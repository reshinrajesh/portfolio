import { Node } from '@tiptap/core'

export interface IframeOptions {
    allowFullscreen: boolean
    HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        iframe: {
            /**
             * Set an iframe node
             */
            setIframe: (options: { src: string }) => ReturnType
        }
    }
}

export const Iframe = Node.create<IframeOptions>({
    name: 'iframe',

    group: 'block',

    atom: true,

    addOptions() {
        return {
            allowFullscreen: true,
            HTMLAttributes: {
                class: 'w-full aspect-video rounded-lg overflow-hidden border border-border my-4 shadow-sm',
            },
        }
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
            frameborder: {
                default: 0,
            },
            allowfullscreen: {
                default: this.options.allowFullscreen,
                parseHTML: () => this.options.allowFullscreen,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'iframe',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', this.options.HTMLAttributes, ['iframe', { ...HTMLAttributes, class: 'w-full h-full' }]]
    },

    addCommands() {
        return {
            setIframe:
                (options) =>
                    ({ tr, dispatch }) => {
                        const { selection } = tr
                        const node = this.type.create(options)

                        if (dispatch) {
                            tr.replaceRangeWith(selection.from, selection.to, node)
                        }

                        return true
                    },
        }
    },
})
