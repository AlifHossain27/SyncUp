"use client";

import React from "react";
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Inbox, Newspaper } from 'lucide-react';
import { get_archive_newsletters } from "@/actions/newsletters";
import Link from "next/link";
import { useInfiniteQuery } from '@tanstack/react-query';

interface Newsletter {
  uuid: string;
  title: string;
  slug: string;
  thumbnail?: string;
  status: string;
  published_at: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function NewsletterCard({ newsletter }: { newsletter: Newsletter }) {
  return (
    <Link href={`/newsletter/${newsletter.slug}`} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden p-0 m-0 border-border/60 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
        <div className="relative overflow-hidden w-full h-48">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="flex-grow p-5 pb-2">
          <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
            {formatDate(newsletter.published_at)}
          </span>
          <CardTitle className="mt-2 font-headline text-lg leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
            {newsletter.title}
          </CardTitle>
        </CardContent>

        <CardFooter className="p-5 pt-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Read newsletter
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-5 w-3/4 bg-muted rounded" />
        <div className="h-5 w-1/2 bg-muted rounded" />
      </div>
    </div>
  );
}

const ArchiveList = () => {
  const fetchArchives = async ({ pageParam = 0 }) => {
    const limit = 6;
    const resp = await get_archive_newsletters(pageParam, limit);
    if (!resp.ok) throw new Error("Failed to load Archive");

    return {
      newsletters: resp.body,
      nextPage: resp.body.length === limit ? pageParam + 1 : undefined,
    };
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["archive-list"],
    queryFn: fetchArchives,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const allNewsletters = data?.pages.flatMap((page) => page.newsletters) ?? [];

  return (
    <section id="archive" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-14">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Archive
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
            Newsletter Archive
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our full collection of past newsletters and catch up on
            any insights you might have missed from the SyncUp community.
          </p>
        </div>

        {status === "pending" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : status === "error" ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-destructive font-medium">Couldn&apos;t load the archive</p>
            <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
          </div>
        ) : allNewsletters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <Inbox className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">No newsletters yet — check back soon.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-10">
              {allNewsletters.map((newsletter: Newsletter) => (
                <NewsletterCard key={newsletter.uuid} newsletter={newsletter} />
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="rounded-full px-8"
                >
                  {isFetchingNextPage ? "Loading more..." : "Load more"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ArchiveList;