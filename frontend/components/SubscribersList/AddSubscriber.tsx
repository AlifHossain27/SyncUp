"use client";

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from "@/components/ui/input"
import { UserPlus, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter,
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
import { DialogDescription } from '@radix-ui/react-dialog'

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
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          first_name: "",
          last_name: "",
          email: "",
          department: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const resp = await add_subscriber(values.first_name, values.last_name, values.email, values.department)
            if (resp.ok) {
                await router.refresh()
                form.reset();
                toast.success("Successfully added new subscriber")
                setTimeout(() => {
                    document.getElementById("dialog-close-button")?.click();
                }, 50);
            } else {
                toast.error(
                    `${resp.body?.detail} (Status ${resp.status})`
                );
                await router.refresh()
            }
        } finally {
            setIsSubmitting(false)
        }
    }

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant='default' size='lg' className="gap-2">
                <UserPlus className="h-5 w-5" />
                Add Subscriber
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader className="space-y-1">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl">Add New Subscriber</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Enter the details of the new subscriber
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input autoComplete='off' placeholder="John" {...field} />
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
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input autoComplete='off' placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" autoComplete='off' placeholder="john.doe@example.com" {...field} />
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
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                    <Input autoComplete='off' placeholder="e.g., Computer Science" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter className="pt-4 gap-2 sm:gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" id="dialog-close-button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting} className="gap-2">
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Adding..." : "Add Subscriber"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}


export default AddSubscriber