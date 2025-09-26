import { Input } from './ui/input';
import { Button } from './ui/button';
import { CheckCircle } from 'lucide-react';

const SubscriptionAim = () => {
    return (
        <section id="subscribe" className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                            Why SyncUp?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            SyncUp is more than just a newsletter; it's a community of innovators, thinkers, and builders from the University Computer Club. We aim to deliver high-quality content that not only informs but also inspires.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-primary" />
                                <span className="text-muted-foreground">Deep dives into emerging technologies.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-primary" />
                                <span className="text-muted-foreground">Exclusive interviews with industry experts and alumni.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-primary" />
                                <span className="text-muted-foreground">Career advice and internship opportunities.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-primary" />
                                <span className="text-muted-foreground">Updates on club projects, workshops, and events.</span>
                            </li>
                        </ul>
                    </div>
                     <div className="p-10 bg-card rounded-lg shadow-lg border border-border">
                        <h3 className="text-2xl font-bold font-headline mb-4">Subscribe to SyncUp</h3>
                        <p className="text-muted-foreground mb-6">Get the latest insights from our community, delivered straight to your inbox every week.</p>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input type="text" placeholder="First Name" className="bg-background text-base" />
                                <Input type="text" placeholder="Last Name" className="bg-background text-base" />
                            </div>
                            <Input type="text" placeholder="Department" className="bg-background text-base" />
                            <Input type="email" placeholder="your.email@g.bracu.ac.bd" className="bg-background text-base" />
                            <Button type="submit" size="lg" className="w-full">Subscribe</Button>
                        </form>
                         <p className="text-xs text-muted-foreground mt-4">We respect your privacy. No spam.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SubscriptionAim;
