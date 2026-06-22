"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import { get_recent_event, get_upcoming_event } from '@/actions/events';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';

type Event = {
  uuid: number;
  title: string;
  desc: string;
  event_date: string;
  start: string;
  end: string;
  location: string;
  link: string;
}

function EventCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl flex flex-col animate-pulse">
      <div className="p-6 space-y-3">
        <div className="h-5 w-2/3 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
      </div>
      <div className="p-6 pt-0 space-y-3 flex-grow">
        <div className="h-4 w-1/2 bg-muted rounded" />
        <div className="h-4 w-1/3 bg-muted rounded" />
        <div className="h-4 w-2/5 bg-muted rounded" />
      </div>
      <div className="p-6 pt-0">
        <div className="h-9 w-full bg-muted rounded-md" />
      </div>
    </div>
  );
}

const EventList = () => {
  const { data: upcomingEvents, isLoading: loadingUpcoming } = useQuery({
    queryFn: get_upcoming_event,
    queryKey: ['upcomingEvents']
  });

  const fetchRecent = async ({ pageParam = 0 }) => {
      const limit = 3;
      const resp = await get_recent_event(pageParam, limit);
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
      queryKey: ["recentEvents"],
      queryFn: fetchRecent,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    const recentEvents = data?.pages.flatMap((page) => page.newsletters) ?? [];

    const EventCard = ({ event }: { event: Event }) => (
      <Card className="bg-card border-border flex flex-col group transform transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
        <CardHeader>
            <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
            <CardDescription>{event.desc}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
           <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(
                      event.event_date
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
           </div>
           <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>{event.start} - {event.end}</span>
            </div>
           <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
           </div>
        </CardContent>
        <div className="p-6 pt-0">
            <Button variant="outline" className="w-full group/button">
              <Link href={event.link} className='w-full flex items-center justify-center'>
                  Learn More <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/button:translate-x-1" />
              </Link>
            </Button>
        </div>
      </Card>
    );

    return (
        <section id="events" className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground">Community Events</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Join our community for workshops, talks, and our annual hackathon.
              </p>
            </div>
            
            <div className="space-y-16">
                <div>
                    <h3 className="text-2xl font-bold font-headline text-foreground mb-8">Upcoming Events</h3>
                     {loadingUpcoming ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <EventCardSkeleton key={i} />
                        ))}
                      </div>
                    ) : upcomingEvents && upcomingEvents.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.map((event:Event) => (
                          <EventCard key={event.uuid} event={event} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No upcoming events.</p>
                    )}
                </div>
                <div>
                    <h3 className="text-2xl font-bold font-headline text-foreground mb-8">Past Events</h3>
                    {status === "pending" ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <EventCardSkeleton key={i} />
                        ))}
                      </div>
                    ) : status === "error" ? (
                      <p className="text-center text-red-500">
                        {(error as Error).message}
                      </p>
                    ) : recentEvents.length > 0 ? (
                      <div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentEvents.map((event:Event) => (
                          <EventCard key={event.uuid} event={event} />
                        ))}
                      </div>
                      {hasNextPage && (
                          <div className="w-full flex justify-center p-10">
                            <Button
                              onClick={() => fetchNextPage()}
                              disabled={isFetchingNextPage}
                            >
                              {isFetchingNextPage ? "Loading more..." : "Load More"}
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No past events.</p>
                    )}
                </div>
            </div>
          </div>
        </section>
    );
};
export default EventList;