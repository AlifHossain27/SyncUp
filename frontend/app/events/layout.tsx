'use client'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()
export default function EventsLayout({
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