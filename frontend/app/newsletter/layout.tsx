'use client'
import Header from '@/components/Header'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()
export default function NewsletterLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
return(
        <div className=''>
            <section>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
            </section>
        </div>
            
    )
}