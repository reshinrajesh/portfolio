import { Node, mergeAttributes } from '@tiptap/core';

export interface VideoOptions {
    HTMLAttributes: Record<string, any>;
}

export const VideoExtension = Node.create<VideoOptions>({
    name: 'video',

    group: 'block',

    selectable: true,

    draggable: true,

    atom: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
            controls: {
                default: true,
            },
            width: {
                default: '100%',
            },
            height: {
                default: 'auto',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'video',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['video', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },
});
