"use client";

import React from 'react'
import { Button } from '../ui/button'
import { Input } from "@/components/ui/input"
import { UserRoundPen } from 'lucide-react';
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogDescription,
  } from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { update_subscriber } from '@/actions/subscribers'

const SUBSCRIBER_TYPES = ["General", "Alumni", "Faculty", "OCA"] as const

const formSchema = z.object({
    first_name: z.string().min(4, {
      message: "First Name must be at least 4 characters.",
    }),
    last_name: z.string().min(4, {
        message: "Last Name must be at least 4 characters.",
      }),
    email: z.email(),
    department: z.string().min(2, {
      message: "Department must be at least 2 characters.",
    }),
    subscriber_type: z.enum(SUBSCRIBER_TYPES),
})

type SubscriberDataProps = {
    uuid: string,
    first_name: string,
    last_name: string,
    email: string,
    department: string,
    subscriber_type: typeof SUBSCRIBER_TYPES[number],
}

const UpdateSubscriber = ({uuid, first_name, last_name, email, department, subscriber_type}: SubscriberDataProps) => {
    const router = useRouter()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          first_name: first_name,
          last_name: last_name,
          email: email,
          department: department,
          subscriber_type: subscriber_type,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>){
        const resp = await update_subscriber(uuid, values.first_name, values.last_name, values.email, values.department, values.subscriber_type)
        if (resp.ok){
            await router.refresh()
            toast("Successfully Updated Subscriber",)
            setTimeout(() => {
                document.getElementById("dialog-close-button")?.click();
                }, 50);
        } else {  
            await router.refresh()
            toast.error(
                `${resp.body?.detail} (Status ${resp.status})`
            );
        }
    }

  return (
    <div>
    <Dialog>
        <DialogTrigger asChild>
            <Button variant='outline' size='lg'><UserRoundPen size={40}/></Button>
        </DialogTrigger>
        <DialogContent className='px-10 py-15'>
            <DialogHeader>
                <DialogTitle className="text-2xl">Update Subscriber:</DialogTitle>
                <DialogDescription className='text-sm text-gray-500'>Update the details for {first_name} {last_name}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem className='flex'>
                            <FormLabel className='w-40 text-md'>First Name:</FormLabel>
                        <FormControl>
                            <Input autoComplete='off' placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                        <FormItem className='flex'>
                            <FormLabel className='w-40 text-md'>Last Name:</FormLabel>
                        <FormControl>
                            <Input autoComplete='off' placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className='flex'>
                            <FormLabel className='w-40 text-md'>Email:</FormLabel>
                        <FormControl>
                            <Input autoComplete='off' placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem className='flex'>
                            <FormLabel className='w-40 text-md'>Department:</FormLabel>
                        <FormControl>
                            <Input autoComplete='off' placeholder="Department" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="subscriber_type"
                    render={({ field }) => (
                        <FormItem className='flex'>
                            <FormLabel className='w-40 text-md'>Type:</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {SUBSCRIBER_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                        <div className='pt-5'>
                            <Button className='text-center w-full h-10 text-lg' type="submit" >Update Subscriber</Button>
                        </div>
                </form>
            </Form>
            <DialogClose asChild>
                    <Button id="dialog-close-button" className="hidden" />
            </DialogClose>
        </DialogContent>
        </Dialog>
    </div>
  )
}

export default UpdateSubscriber