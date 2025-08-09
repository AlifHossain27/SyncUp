"use client";

import React, { useEffect, useState } from "react";
import { delete_newsletter, get_draft_newsletters } from "@/actions/newsletters";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Send, Trash2 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImSpinner2 } from "react-icons/im";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";


interface Newsletter {
  uuid: string;
  title: string;
  slug: string;
  summary?: string;
  thumbnail?: string;
  status: string;
}

const DraftList = () => {
  const [drafts, setDrafts] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchDrafts() {
      const resp = await get_draft_newsletters();
      if (resp.ok) {
        setDrafts(resp.body);
      } else {
        toast.error("Failed to load drafts");
      }
      setLoading(false);
    }
    fetchDrafts();
  }, []);

  if (loading) return (<div className='pt-20 flex justify-center'>
          <ImSpinner2 className="animate-spin" size="50" />
        </div>);

  const openDeleteDialog = (uuid: string) => {
    setDeleteTarget(uuid);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const resp = await delete_newsletter(deleteTarget);
    if (resp.ok) {
      toast.success("Newsletter deleted");
      setDrafts((prev) => prev.filter((nl) => nl.uuid !== deleteTarget));
    } else {
      toast.error("Failed to delete newsletter");
    }
    setDialogOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-5 md:py-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Drafts</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Create, edit, and publish your upcoming newsletters.
          </p>
        </div>
        <Button size="lg">
          <Link href="/newsletter/editor" className="flex">
            <PlusCircle className="h-5 w-5 mr-2" />
            Create New Newsletter
          </Link>
        </Button>
      </div>
      {loading ? (
        <div className='flex justify-center'>
          <ImSpinner2 className="animate-spin" size="50" />
        </div>
      ) : 
      (<div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
        {drafts.length === 0 && <p>No drafts found.</p>}
        {drafts.map((newsletter) => (
          <Card
            key={newsletter.uuid}
            className="bg-card border-border overflow-hidden group flex flex-col transform transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 p-0 m-0"
          >
            <div className="overflow-hidden relative m-0 p-0">
              <Image
                src={newsletter.thumbnail ?? "https://www.geoface.com/wp-content/themes/u-design/assets/images/placeholders/post-placeholder.jpg"}
                alt={newsletter.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 block"
              />
              <Badge
                variant="secondary"
                className="absolute top-4 left-4 bg-yellow-400/80 text-yellow-900 backdrop-blur-sm"
              >
                Draft
              </Badge>
            </div>
            <CardContent className="p-6 space-y-3 flex-grow">
              <CardTitle className="font-headline text-xl text-foreground">{newsletter.title}</CardTitle>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-end items-end gap-2">
              <Link href={`/newsletter/editor/${newsletter.slug}`}>
                <Button variant="outline" size="sm" className="hover:cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </Link>
              <Button variant="destructive" size="icon" className="hover:cursor-pointer" onClick={() => openDeleteDialog(newsletter.uuid)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>)}
      <Separator className="my-16" />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this newsletter? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DraftList;
