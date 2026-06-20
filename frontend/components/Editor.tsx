"use client";

import { BlockNoteEditor, PartialBlock, BlockNoteSchema } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/core/fonts/inter.css';
import "@blocknote/shadcn/style.css";
import {
    multiColumnDropCursor,
    locales as multiColumnLocales,
    withMultiColumn,
} from "@blocknote/xl-multi-column";
import {
    BasicTextStyleButton,
    BlockTypeSelect,
    ColorStyleButton,
    CreateLinkButton,
    FileCaptionButton,
    FileReplaceButton,
    FormattingToolbar,
    FormattingToolbarController,
    NestBlockButton,
    TextAlignButton,
    UnnestBlockButton,
} from "@blocknote/react";
import { en as coreLocaleEn } from "@blocknote/core/locales";
import { useEffect, useRef } from 'react';
import { uploadFiles } from '@/utils/uploadthing';

const schema = withMultiColumn(BlockNoteSchema.create());

interface EditorProps {
    initialContent?: string;
    editable?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEditorReady: (editor: BlockNoteEditor<any, any, any>) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, editable = true, onEditorReady }) => {
    const editor = useCreateBlockNote({
        schema,
        dropCursor: multiColumnDropCursor,
        dictionary: {
            ...coreLocaleEn,
            multi_column: multiColumnLocales.en,
        },
        uploadFile: async (file: File) => {
            const [res] = await uploadFiles('imageUploader', { files: [file] });
            return res.ufsUrl;
        }
    });

    const loadedRef = useRef(false);

    useEffect(() => {
        onEditorReady(editor);
    }, [editor, onEditorReady]);

    // Load initialContent into the editor once it actually arrives.
    // useCreateBlockNote only applies its initialContent option on first
    // mount, so if the prop shows up later (e.g. after an async fetch in
    // the parent), we need to push it in manually.
    useEffect(() => {
        if (!initialContent || loadedRef.current) return;
        try {
            const blocks = JSON.parse(initialContent) as PartialBlock[];
            editor.replaceBlocks(editor.document, blocks);
            loadedRef.current = true;
        } catch (err) {
            console.error("Failed to parse initialContent:", err);
        }
    }, [initialContent, editor]);

    return (
        <div className="-mx-[54px] my-4">
            <BlockNoteView
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                editor={editor as BlockNoteEditor<any, any, any>}
                editable={editable}
                theme="light"
            >
                <FormattingToolbarController
                    formattingToolbar={() => (
                        <FormattingToolbar>
                            <BlockTypeSelect key={"blockTypeSelect"} />
                            <FileCaptionButton key={"fileCaptionButton"} />
                            <FileReplaceButton key={"replaceFileButton"} />
                            <BasicTextStyleButton basicTextStyle={"bold"} key={"boldStyleButton"} />
                            <BasicTextStyleButton basicTextStyle={"italic"} key={"italicStyleButton"} />
                            <BasicTextStyleButton basicTextStyle={"underline"} key={"underlineStyleButton"} />
                            <BasicTextStyleButton basicTextStyle={"strike"} key={"strikeStyleButton"} />
                            <BasicTextStyleButton key={"codeStyleButton"} basicTextStyle={"code"} />
                            <TextAlignButton textAlignment={"left"} key={"textAlignLeftButton"} />
                            <TextAlignButton textAlignment={"center"} key={"textAlignCenterButton"} />
                            <TextAlignButton textAlignment={"right"} key={"textAlignRightButton"} />
                            <TextAlignButton textAlignment="justify" key="alignJustify" />
                            <ColorStyleButton key={"colorStyleButton"} />
                            <NestBlockButton key={"nestBlockButton"} />
                            <UnnestBlockButton key={"unnestBlockButton"} />
                            <CreateLinkButton key={"createLinkButton"} />
                        </FormattingToolbar>
                    )}
                />
            </BlockNoteView>
        </div>
    );
};

export default Editor;