import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'
import NotificationSystem from '@/components/NotificationSystem'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GSM Monitor',
  description: 'Monitor and manage GSM ports across multiple zones',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="border-t py-4 text-center text-sm text-muted-foreground">
              <p>© 2023 GSM Monitor. All rights reserved.</p>
            </footer>
          </div>
          <NotificationSystem />
        </ThemeProvider>
      </body>
    </html>
  )
}

