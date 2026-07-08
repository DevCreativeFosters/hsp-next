'use client';

import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCart } from '@contexts/cart-context';

import { fetchAPI } from '@lib/fetch-api';

import Loading from '@components/loading/loading';

import styles from './quotes.module.scss';

// items{ ... } was added 2026-07-08 so Accept Quote can dump the
// quoted line items straight into the WC cart. If Lokesh's
// resolver doesn't expose them yet the query will return items
// as null / an empty array, and the accept flow just falls
// through to the redirect (the mutation may still populate the
// cart server-side).
const GET_QUOTES = `
  query DealerQuotes($userId: Int!) {
    dealerQuotes(user_id: $userId) {
      id
      quote_number
      amount
      status
      notes
      issue_date
      expiry_date
      is_expired
      valid_days
      download_url
      created_at
      items {
        product_id
        variant_name
        variant_sku
        variant_slug
        quantity
        price
      }
    }
  }
`;

// The accept/cancel/request mutations take a single `input` object whose type
// name isn't exposed in the API collection, so we inline the values (matching
// the Postman examples) rather than using GraphQL variables.
const getAuthToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

const runQuoteAction = async (mutation, quoteId, fieldName, fieldValue) => {
  const query = `
    mutation {
      ${mutation}(input: {
        quote_id: ${parseInt(quoteId)},
        ${fieldName}: ${JSON.stringify(fieldValue || '')}
      }) {
        message
        quote {
          id
          status
        }
      }
    }
  `;
  // Quote mutations require the dealer auth token (same as createDealerQuote).
  return fetchAPI(query, { authToken: getAuthToken() });
};

const isExpired = quote => {
  if (quote.is_expired != null) return quote.is_expired;
  if (!quote.expiry_date) return false;
  const exp = new Date(quote.expiry_date);
  return !Number.isNaN(exp.getTime()) && exp < new Date();
};

const isClosed = quote => {
  const status = (quote.status || '').toLowerCase();
  return (
    isExpired(quote) ||
    /accept|cancel|expire|reject|close|complete/.test(status)
  );
};

function Quote({ onAccepted, onChanged, quote }) {
  const [busy, setBusy] = useState(false);
  const closed = isClosed(quote);

  const statusLabel = isExpired(quote)
    ? 'Quote Expired'
    : `Quote ${(quote.status || '').charAt(0).toUpperCase()}${(
        quote.status || ''
      ).slice(1)}`.trim();

  const handleAction = async (mutation, field, value) => {
    setBusy(true);
    try {
      const res = await runQuoteAction(mutation, quote.id, field, value);
      if (mutation === 'acceptDealerQuote') {
        await onAccepted?.(quote, res);
      }
      await onChanged();
    } catch (err) {
      console.error(`Error running ${mutation}:`, err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.quoteCard}>
      <div className={styles.topRow}>
        <h4 className={styles.quoteNumber}>
          {quote.quote_number || `#${quote.id}`}
        </h4>
        {closed ? (
          <div className={styles.statusLabel}>{statusLabel}</div>
        ) : (
          <div className={styles.amount}>${Number(quote.amount)}</div>
        )}
      </div>

      <div className={styles.dateRow}>
        <strong>Date of issue:</strong> {quote.issue_date}
      </div>

      <div className={styles.actions}>
        <div className={styles.leftActions}>
          {closed ? (
            <button
              className={styles.acceptBtn}
              disabled={busy}
              onClick={() =>
                handleAction(
                  'requestDealerQuote',
                  'notes',
                  'Need revised pricing',
                )
              }
              type="button"
            >
              Request a New Quote
            </button>
          ) : (
            <button
              className={styles.acceptBtn}
              disabled={busy}
              onClick={() =>
                handleAction('acceptDealerQuote', 'notes', 'Accepted by dealer')
              }
              type="button"
            >
              Accept Quote
            </button>
          )}
          {quote.download_url && (
            <a
              className={styles.downloadBtn}
              href={quote.download_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              Download Quote
            </a>
          )}
        </div>

        {!closed && (
          <button
            className={styles.cancelLink}
            disabled={busy}
            onClick={() =>
              handleAction('cancelDealerQuote', 'reason', 'Cancelled by dealer')
            }
            type="button"
          >
            Cancel Quote
          </button>
        )}
      </div>

      {!closed && quote.valid_days != null && (
        <div className={styles.validNote}>
          Quote is valid for {quote.valid_days} days.
        </div>
      )}
    </div>
  );
}

export default function Quotes() {
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const router = useRouter();
  const { addToCart } = useCart() || {};

  const getQuotes = useCallback(async () => {
    const userId = parseInt(localStorage.getItem('userId'));
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetchAPI(GET_QUOTES, {
        authToken: getAuthToken(),
        variables: { userId },
      });
      setQuotes(res?.dealerQuotes || []);
    } catch (e) {
      console.error('Error getting quotes:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fires after acceptDealerQuote resolves. Iterates the
  // quote's line items and pushes each into the WC cart via
  // the cart context, then routes to /cart. Sequential (not
  // Promise.all) so buildShadowItem and getCartItems don't
  // clobber each other. If the resolver hasn't returned items
  // yet, this is a no-op and the redirect still runs.
  const handleAccepted = useCallback(
    async quote => {
      const items = Array.isArray(quote?.items) ? quote.items : [];
      if (addToCart && items.length) {
        for (const item of items) {
          const productId = parseInt(item.product_id);
          const quantity = parseInt(item.quantity) || 1;
          if (!productId) continue;
          try {
            await addToCart({
              productId,
              quantity,
              ...(item.variant_name && { variant_name: item.variant_name }),
              ...(item.variant_sku && { variant_sku: item.variant_sku }),
              ...(item.variant_slug && { variant_slug: item.variant_slug }),
              ...(item.price != null && { price: Number(item.price) }),
            });
          } catch (err) {
            console.error('Failed adding quote item to cart:', err);
          }
        }
      }
      router.push('/cart');
    },
    [addToCart, router],
  );

  useEffect(() => {
    getQuotes();
  }, [getQuotes]);

  if (loading) {
    return (
      <div className={styles.quotes}>
        <Loading color="white" size="large" />
      </div>
    );
  }

  return (
    <div className={styles.quotes}>
      {quotes.length === 0 ? (
        <div className={styles.noQuotes}>
          <h3>No quotes here yet</h3>
          <p>
            Start a quote from the <Link href="/checkout">checkout</Link>.
          </p>
        </div>
      ) : (
        quotes.map(quote => (
          <Quote
            key={quote.id}
            onAccepted={handleAccepted}
            onChanged={getQuotes}
            quote={quote}
          />
        ))
      )}
      <Link className={styles.exploreBtn} href="/shop-by-ute-make">
        Explore More Items
      </Link>
    </div>
  );
}
