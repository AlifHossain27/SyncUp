import React from 'react'
import { Button } from '../ui/button'
import { Input } from "@/components/ui/input"
import {  UserPlus } from "lucide-react"
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
  } from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { add_subscriber } from '@/actions/subscribers'

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
  })


const AddSubscriber = () => {
    const router = useRouter()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          first_name: "",
          last_name: "",
          email: "",
          department: ""

        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>){
        const resp = await add_subscriber(values.first_name, values.last_name, values.email, values.department)
        if (resp.ok){
            await router.refresh()
            await form.reset();
            toast("Successfully Added New Subscriber",)
            setTimeout(() => {
                document.getElementById("dialog-close-button")?.click();
                }, 50);
        } else {  
            toast.error(
                `${resp.body?.detail} (Status ${resp.status})`
            );
            await router.refresh()
        }
    }

  return (
    <div>
    <Dialog>
        <DialogTrigger asChild>
            <Button variant='default' size='lg'><UserPlus size={40}/>Add Subscriber</Button>
        </DialogTrigger>
        <DialogContent className='py-15 px-10'>
            <DialogHeader>
            <DialogTitle className="text-2xl">Add New Subscriber:</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem>
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
                        <FormItem>
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
                        <FormItem>
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
                        <FormItem>
                        <FormControl>
                            <Input autoComplete='off' placeholder="Department" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                        <Button className='text-center w-full h-10 text-lg' type="submit" >Add Subscriber</Button>
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

export default AddSubscriber