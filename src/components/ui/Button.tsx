import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-black uppercase tracking-wider ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-[2px] active:translate-x-[2px] active:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white hover:bg-indigo-500 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]",
        destructive: "bg-rose-500 text-white hover:bg-rose-400 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]",
        outline: "bg-white text-slate-900 hover:bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]",
        secondary: "bg-amber-400 text-slate-900 hover:bg-amber-300 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]",
        ghost: "hover:bg-slate-100 hover:text-slate-900 border-2 border-transparent",
        link: "text-indigo-600 underline-offset-4 hover:underline",
        correct: "bg-emerald-400 text-slate-900 hover:bg-emerald-300 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]",
        incorrect: "bg-rose-500 text-white hover:bg-rose-400 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-14 rounded-2xl px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Determine if we need to use standard button or generic slot
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
