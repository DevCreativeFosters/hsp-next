import './globals.css'

export const metadata = {
  title: 'HSP 4x4',
  description: 'HSP',
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
