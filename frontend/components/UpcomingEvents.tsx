import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';

const events = [
    {
        title: "Annual Hackathon 'CodeSprint'",
        description: "Join us for a 24-hour coding marathon. Build innovative projects, win prizes, and network with sponsors.",
        date: "Nov 15-16, 2024",
        location: "09B-09L"
    },
    {
        title: "Workshop: Intro to React Hooks",
        description: "A hands-on workshop covering the fundamentals of React Hooks, from useState to custom hooks.",
        date: "Nov 22, 2024",
        location: "Online via Zoom"
    },
    {
        title: "Tech Talk: The Future of AI Ethics",
        description: "A guest lecture from Dr. Alana Reed on the ethical challenges and responsibilities in AI development.",
        date: "Dec 05, 2024",
        location: "Auditorium"
    }
]

const UpcomingEvents = () => {
    return (
        <section id="events" className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Upcoming Events</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join our community for workshops, talks, and our annual hackathon.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <Card key={event.title} className="bg-card border-border flex flex-col">
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
                                <CardDescription>{event.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                               <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>{event.date}</span>
                               </div>
                               <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span>{event.location}</span>
                               </div>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Button variant="outline" className="w-full group">
                                    Learn More <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UpcomingEvents;
