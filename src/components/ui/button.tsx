import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants"

const buttonVariants = tv({
    base: 'w-full p-2 text-white bg-blue-base rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',

    variants: {
        color: {
            primary: 'h-[48px] hover:bg-blue-dark disabled:bg-blue-base',
            secondary: 'text-gray-500 bg-gray-200 border hover:border-blue-dark w-fit flex flex-row items-center',
        }
    },

    defaultVariants: {
        color: 'primary'
    },
})

export function Button({ color, className, ...props }: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
    return <button className={buttonVariants({ color, className })} {...props} />;
}