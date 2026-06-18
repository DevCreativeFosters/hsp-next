'use client';

// Last-resort error boundary for /checkout. Without this, any client-side
// throw renders Next.js's default "Application error" black screen with no
// way to recover. Here we surface a message and a retry button so the user
// can keep moving (and the actual error still logs to the console).
export default function CheckoutError({ error, reset }) {
  if (typeof window !== 'undefined') {
    console.error('Checkout error boundary caught:', error);
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
        Something went wrong on the checkout page.
      </h2>
      <p style={{ opacity: 0.8 }}>
        Please refresh the page and try again. If it keeps happening, contact
        support with the order details you were entering.
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
