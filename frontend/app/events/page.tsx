'use client'
import { useAppSelector } from '@/redux/store'
import EventList from '@/components/EventList';
import CreateEvent from '@/components/CreateEvent';


export default function EventsPage() {
    const isAuth = useAppSelector((state) => state.auth.isAuthenticated)
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        {isAuth && (
            <div className='w-full flex items-end justify-end p-10'>
                <CreateEvent/>
            </div>
            
        )}
        <EventList />
      </main>

    </div>
  );
}
