import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AviShifo',
  description: 'Created with AviShifo',
  generator: 'AviShifo',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
