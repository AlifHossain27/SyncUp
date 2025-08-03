import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react';
import { delete_subscriber } from '@/actions/subscribers';

type SubscriberDataProps = {
    uuid: string,
    first_name: string,
    last_name: string,
    email: string,
    department: string
}

const DeleteSubscriber = ({uuid, first_name, last_name, email, department}: SubscriberDataProps) => {
    const router = useRouter()
    async function deleteSubscriber(){
        const resp = await delete_subscriber(uuid)    
        if (resp.ok){
            await router.refresh()
            toast("Successfully Deleted Subscriber",)
        } else {  
            toast.error(
                `${resp.body?.detail} (Status ${resp.status})`
            );
            await router.refresh()
        }
    }

  return (
    <div>
        <Button variant='destructive' size='lg' onClick={deleteSubscriber}><Trash2 size={40}/></Button>
    </div>
  )
}

export default DeleteSubscriber