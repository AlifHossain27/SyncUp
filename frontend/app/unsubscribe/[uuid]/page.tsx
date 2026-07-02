"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { MailX, Loader2, CheckCircle2 } from "lucide-react";
import { unsubscribe } from "@/actions/subscribers";
import Link from "next/link";

export default function UnsubscribePage() {
    const { uuid } = useParams<{ uuid: string }>();
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    async function handleUnsubscribe() {
        setStatus("loading");
        const resp = await unsubscribe(uuid);
        if (resp.ok) {
            setStatus("success");
        } else {
            setStatus("error");
            toast.error(
                resp.status === 404
                    ? "This unsubscribe link is no longer valid."
                    : "Something went wrong. Please try again."
            );
            setStatus("idle");
        }
    }

    if (status === "success") {
        return (
            <div className="flex min-h-[85vh] items-center justify-center px-4">
                <Card className="w-full max-w-md text-center shadow-sm">
                    <CardHeader className="space-y-3 pb-2">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-7 w-7 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">You&apos;re unsubscribed</CardTitle>
                        <CardDescription>
                            You have been successfully removed from the SyncUp newsletter. We&apos;re sorry to see you go.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">Back to homepage</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-[85vh] items-center justify-center px-4">
            <Card className="w-full max-w-md text-center shadow-sm">
                <CardHeader className="space-y-3 pb-2">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                        <MailX className="h-7 w-7 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Unsubscribe from SyncUp?</CardTitle>
                    <CardDescription>
                        You will no longer receive our newsletter. This action cannot be undone — you would need to re-subscribe if you change your mind.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-4">
                    <Button
                        variant="destructive"
                        className="w-full gap-2"
                        onClick={handleUnsubscribe}
                        disabled={status === "loading"}
                    >
                        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                        {status === "loading" ? "Unsubscribing..." : "Yes, unsubscribe me"}
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/">No, keep me subscribed</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}