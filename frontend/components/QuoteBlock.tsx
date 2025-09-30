import { Quote } from 'lucide-react';

const QuoteBlock = () => {
    return (
        <section className="py-20 md:py-28 bg-[#f8f8f8]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <Quote className="h-12 w-12 text-accent mx-auto mb-6" />
                    <blockquote className="text-2xl md:text-3xl font-headline text-foreground italic">
                        "The best way to predict the future is to invent it."
                    </blockquote>
                    <p className="text-lg text-muted-foreground mt-6">- Alan Kay</p>
                </div>
            </div>
        </section>
    );
}

export default QuoteBlock;
