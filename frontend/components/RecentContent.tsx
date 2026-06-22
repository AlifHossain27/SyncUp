"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { get_archive_newsletters } from "@/actions/newsletters";
import Link from "next/link";
import { ArrowRight, Newspaper } from 'lucide-react';

interface Newsletter {
  uuid: string;
  title: string;
  slug: string;
  thumbnail?: string;
  status: string;
  published_at: string;
}

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-6 space-y-4">
        <div className="h-5 w-3/4 bg-muted rounded" />
        <div className="h-5 w-1/2 bg-muted rounded" />
      </div>
      <div className="p-6 pt-0 flex justify-between items-center">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-4 w-16 bg-muted rounded" />
      </div>
    </div>
  );
}

const RecentContent = () => {
    const [content, setContent] = useState<Newsletter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchContent() {
        const resp = await get_archive_newsletters(0,3)
        if (resp.ok) {
        setContent(resp.body);
        } else {
        toast.error("Failed to load drafts");
        }
        setLoading(false);
    }
    fetchContent();
    }, []);
    return (
        <section id="content" className="py-20 md:py-28 bg-[#f8f8f8]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Recent Insights</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Dive into our latest articles and discover something new.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))
                ) : (
                  content.map(newsletter => (
                    <Card
                        key={newsletter.uuid}
                        className="bg-card border-border overflow-hidden group flex flex-col transform transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 p-0 m-0"
                        >
                        <div className="overflow-hidden">
                            {newsletter.thumbnail ? (
                                <Image
                                src={newsletter.thumbnail}
                                alt={newsletter.title}
                                width={600}
                                height={400}
                                className="w-full h-48 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-primary/5">
                                <Newspaper className="h-10 w-10 text-primary/40" />
                                </div>
                            )}
                        </div>
                        <CardContent className="p-6 space-y-4 flex-grow">
                            <CardTitle className="font-headline text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                            {newsletter.title}
                            </CardTitle>
                        </CardContent>
                        <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                            <span>
                            {new Date(
                                newsletter.published_at
                            ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                            </span>
                            <Link href={`/newsletter/${newsletter.slug}`}>
                            <Button
                                variant="link"
                                className="p-0 h-auto text-primary group-hover:underline"
                            >
                                Read More{" "}
                                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                  ))
                )}
            </div>

            <div className="text-center mt-16">
                <Button asChild size="lg">
                    <Link href="/newsletter">
                        View More Articles
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                </Button>
            </div>
          </div>
        </section>
    );
};
export default RecentContent;