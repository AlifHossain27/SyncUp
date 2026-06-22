"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation'
import { get_profile, update_profile, change_password } from "@/actions/profile";
import { User, KeyRound, Loader2 } from "lucide-react";

const profileFormSchema = z.object({
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.email({ message: "Please enter a valid email address." }),
});

const passwordFormSchema = z.object({
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
});

function ProfileSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded-md" />
            </div>
            <div className="space-y-2">
                <div className="h-3 w-28 bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded-md" />
            </div>
            <div className="h-10 w-32 bg-muted rounded-md" />
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter()
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const profileForm = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: "",
            email: "",
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        async function fetchProfile() {
            const resp = await get_profile();
            if (resp.ok) {
                profileForm.reset({
                    username: resp.body.username,
                    email: resp.body.email,
                });
            } else {
                toast.error("Failed to load profile data");
            }
            setLoadingProfile(false);
        }
        fetchProfile();
    }, []);

    async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
        setSavingProfile(true);
        try {
            const resp = await update_profile(values.username, values.email);
            if (resp.ok) {
                toast.success("Profile updated successfully");
                router.refresh();
                profileForm.reset({
                    username: resp.body.username,
                    email: resp.body.email,
                });
            } else {
                toast.error(resp.body?.detail || "Failed to update profile");
            }
        } finally {
            setSavingProfile(false);
        }
    }

    async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
        setSavingPassword(true);
        try {
            const resp = await change_password(values.currentPassword, values.newPassword, values.confirmPassword);
            if (resp.ok) {
                toast.success("Password changed successfully");
                router.refresh();
                passwordForm.reset();
            } else {
                toast.error(resp.body?.detail || "Failed to change password");
            }
        } finally {
            setSavingPassword(false);
        }
    }

    return (
        <div className="container mx-auto max-w-2xl py-10 px-4 sm:px-6 flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your profile information and password.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details here.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingProfile ? (
                        <ProfileSkeleton />
                    ) : (
                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                                <FormField
                                    control={profileForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={profileForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="your.email@university.edu" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={savingProfile} className="gap-2">
                                    {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {savingProfile ? "Saving..." : "Save Changes"}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <KeyRound className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Use a strong, unique password for security.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField
                                    control={passwordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={passwordForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" disabled={savingPassword} className="gap-2">
                                {savingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                                {savingPassword ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}