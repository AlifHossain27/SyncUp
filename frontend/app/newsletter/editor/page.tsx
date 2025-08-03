"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { BlockNoteEditor } from '@blocknote/core'
import { Loader2 } from 'lucide-react'

const NewsLetterEditorPage = () => {
    const [editor, setEditor] = useState<BlockNoteEditor | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [title, setTitle] = useState("")
    
    const Editor = useMemo(
        () => dynamic(() => import('@/components/Editor'), {
            ssr: false,
            loading: () => <p>Loading editor...</p>,
        }),
        []
    )

    const handleSave = async () => {
        if (!editor) return
        
        setIsSaving(true)
        try {
            const content = await editor.blocksToHTMLLossy(editor.document)
            const payload = {
                title: title,
                content: content,
            }
            console.log(payload)
            
            await new Promise(resolve => setTimeout(resolve, 1000))
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className='flex flex-col min-h-[85vh] relative'>
            <div className='container flex flex-col flex-1 mx-auto'>
                <div className='flex-1 px-12 py-10 w-full overflow-y-auto'>
                    <TextareaAutosize 
                        placeholder='Untitled'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
                    />
                    <Editor 
                        onChange={() => {}} 
                        onEditorReady={(editor: BlockNoteEditor) => setEditor(editor)}
                    />
                </div>

                <div className='w-full bg-background py-5 bottom-0'>
                    <div className='container mx-auto'>
                        <div className='flex justify-end items-end gap-4'>
                            <Button 
                                variant='default' 
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                            <Button variant='secondary'>Publish</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsLetterEditorPage