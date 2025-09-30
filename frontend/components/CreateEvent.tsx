'use client'
import React from 'react'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { create_event } from '@/actions/events'

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  link: string;
}

const eventFormSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters." }),
    description: z.string()
        .min(10, { message: "Description must be at least 10 characters." })
        .refine(value => value.split(/\s+/).filter(Boolean).length <= 50, { message: "Description must not exceed 50 words." }),
    date: z.string().min(1, { message: "Date is required." }),
    startTime: z.string().min(1, { message: "Start time is required." }),
    endTime: z.string().min(1, { message: "End time is required." }),
    location: z.string().min(3, { message: "Location must be at least 3 characters." }),
    link: z.url()
}).refine(data => {
    if (!data.date || !data.startTime || !data.endTime) {
        return true;
    }
    const startDateTime = new Date(`${data.date}T${data.startTime}`);
    const endDateTime = new Date(`${data.date}T${data.endTime}`);
    
    if (endDateTime <= startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
    }

    return endDateTime > startDateTime;
}, {
    message: "End time must be after start time.",
    path: ["endTime"],
});

const CreateEvent = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: "",
            description: "",
            date: "",
            startTime: "",
            endTime: "",
            location: "",
            link: "",
        },
    });

    const descriptionWordCount = form.watch('description').split(/\s+/).filter(Boolean).length;

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        const resp = await create_event(
            values.title,
            values.description,
            values.date,
            values.startTime,
            values.endTime,
            values.location,
            values.link 
        )
        if (resp.ok){
            await router.refresh()
            await form.reset();
            toast("Successfully Created Event",)
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
    <Dialog>
        <DialogTrigger asChild>
        <Button>
            <PlusCircle className="h-5 w-5 mr-2" />
            Create New Event
        </Button>
      </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Fill out the form below to add a new event to the calendar.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Annual Tech Conference" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe the event..." {...field} rows={5} />
                                    </FormControl>
                                    <div className="text-right text-sm text-muted-foreground">
                                        {descriptionWordCount}/50 words
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Online or Building Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Link of the event" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" size="lg">Create Event</Button>
                    </form>
                </Form>
    </DialogContent>
        <DialogClose asChild>
            <Button id="dialog-close-button" className="hidden" />
        </DialogClose>
    </Dialog>
    
  )
}

export default CreateEvent