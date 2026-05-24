'use client';

import { useState } from 'react';

import { useUserContext } from '@contexts/user';

import { fetchAPI } from '@lib/fetch-api';

import Button from '@components/button/button';

import DownloadIcon from '@assets/icons/downloadicon.svg';

// Quotes expose a `download_url` via the `dealerQuotes(user_id)` query
// (Dealership Module API). We look the quote up by id and open its URL.
export default function DownloadQuoteButton({ quoteId }) {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!user?.id) {
      console.error('No logged-in dealer; cannot fetch quote download URL.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetchAPI(
        `
          query DealerQuotes($userId: Int!) {
            dealerQuotes(user_id: $userId) {
              id
              download_url
            }
          }
        `,
        { variables: { userId: parseInt(user.id) } },
      );

      const quote = res?.dealerQuotes?.find(
        q => String(q.id) === String(quoteId),
      );

      if (quote?.download_url) {
        window.open(quote.download_url, '_blank');
      } else {
        console.error('No download_url found for quote', quoteId);
      }
    } catch (err) {
      console.error('Error downloading quote:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button disabled={loading} onClick={handleDownload} variant="primary">
      {loading ? 'PREPARING…' : 'DOWNLOAD QUOTE'} <DownloadIcon />
    </Button>
  );
}
