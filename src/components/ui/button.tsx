import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ripple-effect",
  {
    variants: {
      variant: {
        default: "bg-red-600 text-white hover:bg-red-700",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-red-600 bg-transparent text-red-600 hover:bg-red-600 hover:text-white",
        secondary:
          "bg-[#e8e8ed] text-[#1d1d1f] hover:bg-[#dcdce0]",
        ghost: "text-red-600 hover:bg-red-50 hover:text-red-700",
        link: "text-red-600 underline-offset-4 hover:underline hover:text-red-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3.5",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
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
