"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Bot } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export default function LoginPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        toast("Login Successful!",);
    }

    return (
        <div className="flex min-h-[85vh] items-center justify-center bg-background">
            <div className="w-full max-w-md">
                 <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <Bot className="h-8 w-8 text-primary" />
                        <span className="text-3xl font-bold font-headline text-foreground">SyncUp</span>
                    </Link>
                </div>
                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
                        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="admin@university.edu" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" size="lg">Login</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                 <p className="mt-4 text-center text-sm text-muted-foreground">
                    <Link href="/" className="underline hover:text-primary">
                        ← Back to homepage
                    </Link>
                </p>
            </div>
        </div>
    );
}
