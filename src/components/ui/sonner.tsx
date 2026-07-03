import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // Detect theme from the document class (matches the app's theme system)
  const isDark = !document.documentElement.classList.contains("light")

  return (
    <Sonner
      theme={isDark ? "dark" : "light"}
      className="toaster group"
      position="top-right"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--theme-surface)] group-[.toaster]:text-[var(--theme-text-main)] group-[.toaster]:border-[var(--theme-border)] group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-[var(--theme-text-muted)]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[var(--theme-bg-alt)] group-[.toast]:text-[var(--theme-text-muted)]",
          success:
            "group-[.toaster]:!border-emerald-500/30 group-[.toaster]:!text-emerald-300 [&_[data-icon]]:!text-emerald-400",
          error:
            "group-[.toaster]:!border-red-500/30 group-[.toaster]:!text-red-300 [&_[data-icon]]:!text-red-400",
          warning:
            "group-[.toaster]:!border-amber-500/30 group-[.toaster]:!text-amber-300 [&_[data-icon]]:!text-amber-400",
          info:
            "group-[.toaster]:!border-purple-500/30 group-[.toaster]:!text-purple-300 [&_[data-icon]]:!text-purple-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
