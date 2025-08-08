import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle, Edit, Send, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const DraftList = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-5 md:py-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">My Drafts</h2>
            <p className="text-lg text-muted-foreground mt-2">Create, edit, and publish your upcoming newsletters.</p>
            </div>
                <Button size="lg">
                    <Link href="/newsletter/editor" className='flex'>
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Create New Newsletter
                    </Link>
                </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
        </div>
        <Separator className="my-16" />
    </div>
  )
}

export default DraftList