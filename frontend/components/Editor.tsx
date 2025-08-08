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
import { useEffect } from 'react';
import { uploadFiles } from '@/utils/uploadthing';

interface EditorProps {
    initialContent?: string;
    editable?: boolean;
    onEditorReady: (editor: BlockNoteEditor<any>) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, editable = true, onEditorReady }) => {
    const editor = useCreateBlockNote({
        schema: withMultiColumn(BlockNoteSchema.create()),
        dropCursor: multiColumnDropCursor,
        dictionary: {
            ...coreLocaleEn,
            multi_column: multiColumnLocales.en,
        },
        initialContent: initialContent
            ? (JSON.parse(initialContent) as PartialBlock[])
            : undefined,
        uploadFile: async(file: File) => {
            const [ res ] = await uploadFiles('imageUploader', {files: [file]});
            return res.ufsUrl
        }
    });

    useEffect(() => {
        onEditorReady(editor);
    }, [editor, onEditorReady]);

    return (
        <div className="-mx-[54px] my-4">
            <BlockNoteView
                editor={editor as BlockNoteEditor<any>}
                editable={editable}
                theme="light"
            >
                <FormattingToolbarController
                    formattingToolbar={() => (
                    <FormattingToolbar>
                        <BlockTypeSelect key={"blockTypeSelect"} />
                            <FileCaptionButton key={"fileCaptionButton"} />
                            <FileReplaceButton key={"replaceFileButton"} />
                            <BasicTextStyleButton
                            basicTextStyle={"bold"}
                            key={"boldStyleButton"}
                            />
                            <BasicTextStyleButton
                            basicTextStyle={"italic"}
                            key={"italicStyleButton"}
                            />
                            <BasicTextStyleButton
                            basicTextStyle={"underline"}
                            key={"underlineStyleButton"}
                            />
                            <BasicTextStyleButton
                            basicTextStyle={"strike"}
                            key={"strikeStyleButton"}
                            />
                            <BasicTextStyleButton
                            key={"codeStyleButton"}
                            basicTextStyle={"code"}
                            />
                            <TextAlignButton
                            textAlignment={"left"}
                            key={"textAlignLeftButton"}
                            />
                            <TextAlignButton
                            textAlignment={"center"}
                            key={"textAlignCenterButton"}
                            />
                            <TextAlignButton
                            textAlignment={"right"}
                            key={"textAlignRightButton"}
                            />
                            <TextAlignButton 
                                textAlignment="justify" 
                                key="alignJustify" 
                            />
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
