import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg-alt)] px-4 py-2 text-sm text-[var(--theme-text-main)] font-body",
          "placeholder:text-[var(--theme-text-dim)]",
          "focus:border-[var(--theme-border-active)] focus:outline-none focus:ring-[3px] focus:ring-primary/15",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
