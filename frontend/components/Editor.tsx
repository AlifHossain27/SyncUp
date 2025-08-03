"use client"
import { BlockNoteEditor, PartialBlock, BlockNoteSchema } from '@blocknote/core';
import {
    useCreateBlockNote,
    SuggestionMenuController,
    getDefaultReactSlashMenuItems,
} from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/core/fonts/inter.css';
import "@blocknote/shadcn/style.css";
import {
    getMultiColumnSlashMenuItems,
    multiColumnDropCursor,
    locales as multiColumnLocales,
    withMultiColumn,
} from "@blocknote/xl-multi-column";
import { en as coreLocaleEn } from "@blocknote/core/locales";
import React, { useMemo } from 'react';

interface EditorProps {
    onChange: () => void;
    initialContent?: string;
    editable?: boolean;
    onEditorReady: (editor: BlockNoteEditor<any>) => void;
}

const Editor: React.FC<EditorProps> = ({ onChange, initialContent, editable, onEditorReady }) => {
    const editor = useCreateBlockNote({
        schema: withMultiColumn(BlockNoteSchema.create()),
        dropCursor: multiColumnDropCursor,
        dictionary: {
            ...coreLocaleEn,
            multi_column: multiColumnLocales.en,
        },
        initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
    });

    React.useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    const getSlashMenuItems = useMemo(() => {
        return async (query: string) => {
            const defaultItems = getDefaultReactSlashMenuItems(editor);
            const columnItems = getMultiColumnSlashMenuItems(editor);
            const uniqueItems = new Map();
            [...defaultItems, ...columnItems].forEach(item => {
                uniqueItems.set(item.title, item);
            });

            return Array.from(uniqueItems.values()).filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase())
            );
        };
    }, [editor]);

    return (
        <div className='-mx-[54px] my-4'>
            <BlockNoteView
                editor={editor as BlockNoteEditor<any>}
                editable={editable}
                onChange={onChange}
                theme='light'
                slashMenu={false}
            >
                <SuggestionMenuController
                    triggerCharacter={"/"}
                    getItems={getSlashMenuItems}
                />
            </BlockNoteView>
        </div>
    );
};

export default Editor;
