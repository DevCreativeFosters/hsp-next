'use client';

// Per-route error boundary for /account/b2b. WP often returns inconsistent
// shapes for the dealer's profile/orders/referrals/etc. and any one of those
// child components throwing will otherwise bring down the entire page as a
// generic black "Application error" screen. Catch the throw, surface a
// useful UI, and log the actual error so it shows up in the console
// (instead of "see the browser console for more information" on a blank
// page).
export default function DealerAccountError({ error, reset }) {
  if (typeof window !== 'undefined') {
    console.error('Dealer account error boundary caught:', error);
  }

  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        minHeight: '60vh',
        padding: 48,
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 600 }}>
        Something went wrong loading your account.
      </h2>
      <p style={{ opacity: 0.8 }}>
        Please refresh the page and try again. If it keeps happening, log out
        and back in, or contact support.
      </p>
      <div>
        <button
          onClick={reset}
          style={{
            background: '#e10600',
            border: 'none',
            borderRadius: 4,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 600,
            padding: '12px 24px',
          }}
          type="button"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
