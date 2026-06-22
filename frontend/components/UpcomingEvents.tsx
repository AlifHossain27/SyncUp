'use client'
import { useState, useEffect } from "react";
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { get_recent_event, get_upcoming_event } from "@/actions/events";
import Link from "next/link";


type Event = {
  uuid: string;
  title: string;
  desc: string;
  event_date: string;
  start: string;
  end: string;
  location: string;
  link: string;
};

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
      </div>
      <div className="p-6 pt-0">
        <div className="h-9 w-full bg-muted rounded-md" />
      </div>
    </div>
  );
}

const UpcomingEvents = () => {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [recentEvents, setRecentEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
        setLoading(true);

        try {
            const upcomingResp = await get_upcoming_event();
            const recentResp = await get_recent_event(0,3);

            setUpcomingEvents(upcomingResp || []);
            setRecentEvents(recentResp.body || []);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchEvents();
    }, []);

    const isUpcoming = upcomingEvents.length > 0;
    const eventsToShow = isUpcoming ? upcomingEvents : recentEvents;
    const displayEvents = eventsToShow.slice(0, 3);

    return (
        <section id="events" className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                    {loading ? "Events" : isUpcoming ? "Upcoming Events" : "Recent Events"}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Join our community for workshops, talks, and our annual hackathon.
                </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <EventCardSkeleton key={i} />
                        ))}
                    </div>
                ) : displayEvents.length > 0 ? (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayEvents.map((event) => (
                        <Card
                        key={event.uuid}
                        className="bg-card border-border flex flex-col group hover:shadow-xl transition-all"
                        >
                        <CardHeader>
                            <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">
                            {event.title}
                            </CardTitle>
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
                            <Button variant="outline" className="w-full group/button" asChild>
                            <Link
                                href={event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center"
                            >
                                Learn More{" "}
                                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/button:translate-x-1" />
                            </Link>
                            </Button>
                        </div>
                        </Card>
                    ))}
                    </div>
                    {eventsToShow.length > 3 && (
                    <div className="mt-10 flex justify-center">
                        <Button asChild size="lg">
                        <Link href="/events">View All Events</Link>
                        </Button>
                    </div>
                    )}
                </>
                ) : (
                <p className="text-muted-foreground text-center">No events available.</p>
                )}
            </div>
        </section>
    );
};

export default UpcomingEvents;