"use client";
import { useRouter, useParams } from 'next/navigation'
import { toast } from "sonner"
import { Button } from '@/components/ui/button';
import TextareaAutosize from 'react-textarea-autosize';
import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import { Loader2 } from 'lucide-react';
import Cover from '@/components/Cover';
import { update_newsletter, get_newsletter } from '@/actions/newsletters';

const NewsLetterUpdatePage = () => {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter()
    const [editor, setEditor] = useState<BlockNoteEditor | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [title, setTitle] = useState("");
    const [coverUrl, setCoverUrl] = useState("")
    const [initialContent, setInitialContent] = useState<string | undefined>();

    const Editor = useMemo(
        () =>
            dynamic(() => import('@/components/Editor'), {
                ssr: false,
                loading: () => <p>Loading editor...</p>,
            }),
        []
    );

    useEffect(() => {
    async function fetchNewsletter() {
      const resp = await get_newsletter(slug);
      if (resp.ok) {
        const data = resp.body;
        setTitle(data.title);
        setCoverUrl(data.thumbnail ?? "");
        setInitialContent(data.content);
      } else {
        toast.error("Failed to load newsletter data");
      }
    }
    fetchNewsletter();
  }, [slug]);

    const handleSave = async () => {
        if (!editor) return;

        setIsSaving(true);
        try {
            const content = await JSON.stringify(editor.document);
            const new_slug = title.toLowerCase().replace(/\s+/g, "-")
            const resp = await update_newsletter(title, content, new_slug, coverUrl, "draft", slug)
           if (resp.ok){
            await router.refresh()
            toast("Newsletter saved",)
            await router.push('/newsletter')
        } else {  
            toast.error(
                `${resp.body?.detail} (Status ${resp.status})`
            );
            await router.refresh()
            }
        }finally {
            setIsSaving(false);
        }
    }
    
    const handlePublish = async () => {
            if (!editor) return;
    
            setIsPublishing(true);
            try {
                const content = await editor.blocksToHTMLLossy(editor.document);
                const new_slug = title.toLowerCase().replace(/\s+/g, "-")
                const resp = await update_newsletter(title, content, new_slug, coverUrl, "published", slug)
               if (resp.ok){
                await router.refresh()
                toast("Newsletter saved",)
                await router.push('/newsletter')
            } else {  
                toast.error(
                    `${resp.body?.detail} (Status ${resp.status})`
                );
                await router.refresh()
                }
            }finally {
                setIsPublishing(false);
            }
        }

    const enableCover = () => {
        setCoverUrl("https://www.geoface.com/wp-content/themes/u-design/assets/images/placeholders/post-placeholder.jpg")
    }

    return (
        <div className="flex flex-col min-h-[85vh] bg-gray-100 py-8">
            <div className="flex flex-col items-center flex-1">
                <div
                    className="
                        bg-white
                        w-full
                        max-w-7xl
                        rounded-lg
                        shadow-lg
                        overflow-hidden
                        flex
                        flex-col
                        min-h-[70vh]
                    "
                >
                    <Cover url={coverUrl} setUrl={setCoverUrl}/>
                    <div className="px-16 py-8 flex flex-col flex-1 overflow-auto">
                        <div className='group flex flex-col gap-2'>
                            {!coverUrl && (
                                <div className='opacity-0 group-hover:opacity-100 transition-opacity'>
                                    <button 
                                        className='hover:bg-neutral-100 text-neutral-400 rounded-md px-3 py-1 transition-colors'
                                        onClick={enableCover}
                                    > Add Cover</button>
                                </div>
                            )}
                            <TextareaAutosize
                            placeholder="Untitled"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full resize-none bg-transparent text-5xl font-bold focus:outline-none mb-6"
                        />
                        </div>

                        <div className="flex-1 min-h-[40vh]">
                            <Editor initialContent={initialContent} onEditorReady={setEditor} />
                        </div>
                    </div>

                    <div className="border-t px-6 py-4 flex justify-end gap-4 bg-white">
                        <Button
                            variant="default"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button 
                            variant="secondary"
                            onClick={handlePublish}
                            disabled={isPublishing}
                        >
                            {isPublishing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isPublishing ? 'Publishing...' : 'Publish'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsLetterUpdatePage;
