"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { get_archive_newsletters } from "@/actions/newsletters";
import Link from "next/link";
import { ArrowRight } from 'lucide-react';

interface Newsletter {
  uuid: string;
  title: string;
  slug: string;
  thumbnail?: string;
  status: string;
  published_at: string;
}

const RecentContent = () => {
    const [content, setContent] = useState<Newsletter[]>([]);

    
    useEffect(() => {
    async function fetchContent() {
        const resp = await get_archive_newsletters(0,3)
        if (resp.ok) {
        setContent(resp.body);
        } else {
        toast.error("Failed to load drafts");
        }
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
                {content.map(newsletter => (
                    <Card
                        key={newsletter.uuid}
                        className="bg-card border-border overflow-hidden group flex flex-col transform transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 p-0 m-0"
                        >
                        <div className="overflow-hidden">
                            <Image
                            src={
                                newsletter.thumbnail ??
                                "https://www.geoface.com/wp-content/themes/u-design/assets/images/placeholders/post-placeholder.jpg"
                            }
                            alt={newsletter.title}
                            width={600}
                            height={400}
                            className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                            />
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
                ))}
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
