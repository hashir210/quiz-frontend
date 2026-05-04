import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-[0_0_20px_rgba(0,25,255,0.3)] hover:shadow-[0_0_28px_rgba(0,25,255,0.5)] hover:bg-[#0014cc] hover:-translate-y-0.5",
        outline:
          "border border-[var(--theme-border)] bg-transparent text-[var(--theme-text-muted)] hover:border-[var(--theme-border-active)] hover:text-[var(--theme-text-main)]",
        ghost:
          "bg-transparent text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-alt)] hover:text-[var(--theme-text-main)]",
        destructive:
          "border border-danger bg-transparent text-danger hover:bg-danger/10",
        link:
          "text-primary underline-offset-4 hover:underline hover:text-primary-hover bg-transparent",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base font-heading font-semibold",
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
