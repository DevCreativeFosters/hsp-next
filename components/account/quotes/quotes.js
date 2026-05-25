'use client';

import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';

import { fetchAPI } from '@lib/fetch-api';

import Loading from '@components/loading/loading';

import styles from './quotes.module.scss';

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

function Quote({ onChanged, quote }) {
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
      await runQuoteAction(mutation, quote.id, field, value);
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
          <Quote key={quote.id} onChanged={getQuotes} quote={quote} />
        ))
      )}
      <Link className={styles.exploreBtn} href="/shop-by-ute-make">
        Explore More Items
      </Link>
    </div>
  );
}
