"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import { ImSpinner2 } from "react-icons/im";
import { get_recent_event, get_upcoming_event } from '@/actions/events';
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



const EventList = () => {
    const [recent, setRecent] = useState<Event[]>([])
    const [upcoming, setUpcoming] = useState<Event[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDrafts() {
            const resp1 = await get_upcoming_event()
            const resp2 = await get_recent_event()
            if (resp1.ok) {
                setUpcoming(resp1.body);
                console.log(resp1)
            } else {
                console.log(resp1.body)
            }
            if (resp2.ok) {
                setRecent(resp2.body);
                console.log(resp2)
            } else {
                console.log(resp2.body)
            }
            setLoading(false);
            }
            fetchDrafts();
    }, []);

    if (loading) return (<div className='pt-20 flex justify-center'>
                <ImSpinner2 className="animate-spin" size="50" />
            </div>);

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
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcoming?.map(event => <EventCard key={event.uuid} event={event} />)}
                    </div>
                </div>
                 <div>
                    <h3 className="text-2xl font-bold font-headline text-foreground mb-8">Past Events</h3>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recent?.map(event => <EventCard key={event.uuid} event={event} />)}
                    </div>
                </div>
            </div>
          </div>
        </section>
    );
};
export default EventList;