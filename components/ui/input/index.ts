import { type VariantProps, cva } from 'class-variance-authority'

export { default as Input } from './Input.vue'

export const inputVariants = cva(
  'flex w-full rounded-md border bg-transparent text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-stone-400',
  {
    variants: {
      variant: {
        default: 'border-stone-200 shadow-sm focus-visible:ring-stone-950 dark:border-stone-800 dark:focus-visible:ring-stone-300',
        ghost: 'border-transparent shadow-none focus-visible:ring-stone-400 dark:focus-visible:ring-stone-500',
        ghostHeader: 'border-transparent shadow-none focus-visible:ring-stone-200 dark:focus-visible:ring-stone-500',
        outline: 'border-stone-300 hover:border-stone-400 focus-visible:ring-stone-400 dark:border-stone-700 dark:hover:border-stone-600 dark:focus-visible:ring-stone-500',
      },
      size: {
        default: 'h-9 px-3 py-1',
        xs: 'h-7 px-2 py-0.5 text-xs',
        sm: 'h-8 px-2.5 py-0.5',
        lg: 'h-10 px-4 py-1.5 text-lg font-medium',
        xl: 'h-12 px-4 py-1.5 text-xl font-bold',
      },
      state: {
        default: '',
        error: 'border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-400',
        success: 'border-green-500 focus-visible:ring-green-500 dark:border-green-400 dark:focus-visible:ring-green-400',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  },
)

export type InputVariants = VariantProps<typeof inputVariants>
