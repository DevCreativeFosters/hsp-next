'use client';

import { fetchAPI } from '@lib/fetch-api';

import Button from '@components/button/button';

import DownloadIcon from '@assets/icons/downloadicon.svg';

export default function DownloadInvoiceButton({ orderId }) {
  async function handleDownload() {
    try {
      const res = await fetchAPI(
        `
          mutation GenerateOrderPDF($orderId: Int!) {
            generateOrderPDF(input: { orderId: $orderId }) {
              success
              message
              pdfUrl
            }
          }
        `,
        { variables: { orderId: parseInt(orderId) } },
      );

      const pdf = res.generateOrderPDF;
      if (pdf?.success && pdf?.pdfUrl) {
        window.open(pdf.pdfUrl, '_blank');
      } else {
        console.error('PDF generation failed:', pdf?.message);
      }
    } catch (err) {
      console.error('Error downloading invoice:', err);
    }
  }

  return (
    <Button onClick={handleDownload} variant="primary">
      DOWNLOAD INVOICE <DownloadIcon />
    </Button>
  );
}
