'use client';

import { useEffect, useState } from 'react';

import styles from './orders.module.scss';

// Small red count bubble that sits next to the "Orders" title in
// the /account sidebar (server-rendered from page.js). Reads two
// localStorage keys published by the inner Orders component:
//
//   hsp_orders_tab_counts = { outstandingordersplaced: N,
//                             outstandingordersreceived: M }
//   hsp_orders_tab_seen   = { outstandingordersplaced: X,
//                             outstandingordersreceived: Y }
//
// Total unseen = (N-X)+ + (M-Y)+. When > 0, render a red pill.
// When the user opens either Outstanding tab, the inner component
// updates hsp_orders_tab_seen to the current count; this component
// re-reads via a custom hsp_orders_tab_counts event and hides.
export default function OrdersSidebarBadge() {
  const [unseen, setUnseen] = useState(0);

  useEffect(() => {
    const recompute = () => {
      try {
        const counts = JSON.parse(
          localStorage.getItem('hsp_orders_tab_counts') || '{}',
        );
        const seen = JSON.parse(
          localStorage.getItem('hsp_orders_tab_seen') || '{}',
        );
        const diff = key => Math.max(0, (counts[key] || 0) - (seen[key] || 0));
        setUnseen(
          diff('outstandingordersplaced') + diff('outstandingordersreceived'),
        );
      } catch {
        setUnseen(0);
      }
    };
    recompute();
    // Same-tab writes from the Orders component:
    window.addEventListener('hsp_orders_tab_counts', recompute);
    // Cross-tab writes from another /account tab:
    window.addEventListener('storage', recompute);
    return () => {
      window.removeEventListener('hsp_orders_tab_counts', recompute);
      window.removeEventListener('storage', recompute);
    };
  }, []);

  if (unseen <= 0) return null;
  return <span className={styles.tabBadge}>{unseen}</span>;
}
