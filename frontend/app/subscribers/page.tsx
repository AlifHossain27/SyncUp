import React from 'react'
import SubscribersDataTable from '@/components/SubscribersList/SubscribersDataTable'

const SubscribersPage = () => {
  return (
    <div className="flex flex-col bg-background">
      
      <main className="flex-grow px-40 py-10">
        <SubscribersDataTable/>
      </main>
      
    </div>
  )
}

export default SubscribersPage