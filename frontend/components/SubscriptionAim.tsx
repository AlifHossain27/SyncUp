"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner"
import { CheckCircle } from 'lucide-react';

const formSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    department: z.string().min(2, { message: "Department must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
});

const SubscriptionAim = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            department: "",
            email: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        toast("Subscribed!");
        form.reset();
    }
    
    return (
        <section id="subscribe" className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                            Why SyncUp?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            SyncUp is more than just a newsletter; it's a community of innovators, thinkers, and builders from BRAC University Computer Club. We aim to deliver high-quality content that not only informs but also inspires.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-primary" />
                                <span className="text-muted-foreground">Deep dives into emerging technologies.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-primary" />
                                <span className="text-muted-foreground">Exclusive interviews with industry experts and alumni.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-primary" />
                                <span className="text-muted-foreground">Career advice and internship opportunities.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-primary" />
                                <span className="text-muted-foreground">Updates on club projects, workshops, and events.</span>
                            </li>
                        </ul>
                    </div>
                     <div className="p-8 bg-card rounded-lg shadow-lg border border-border">
                        <h3 className="text-2xl font-bold font-headline mb-4">Subscribe to SyncUp</h3>
                        <p className="text-muted-foreground mb-6">Get the latest insights from our community, delivered straight to your inbox every week.</p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="John" {...field} className="bg-background text-base" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Doe" {...field} className="bg-background text-base" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="e.g., Computer Science" {...field} className="bg-background text-base" />
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
                                                <Input type="email" autoComplete="off" placeholder="your.email@g.bracu.ac.bd" {...field} className="bg-background text-base" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" size="lg" className="w-full">Subscribe</Button>
                            </form>
                        </Form>
                         <p className="text-xs text-muted-foreground mt-4">We respect your privacy. No spam.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SubscriptionAim;