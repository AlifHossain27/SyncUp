import React from 'react'
import SubscribersDataTable from '@/components/SubscribersList/SubscribersDataTable'

const SubscribersPage = () => {
  return (
    <div className="flex flex-col bg-background">
      
      <main className="container mx-auto py-4 flex flex-col gap-5">
        <SubscribersDataTable/>
      </main>
      
    </div>
  )
}

export default SubscribersPage