import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none active:scale-95 uppercase tracking-normal min-w-0 justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(235,68,50,0.2)] hover:shadow-[0_0_30px_rgba(235,68,50,0.4)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary/20 bg-background hover:bg-primary/10 hover:border-primary/50 text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gaming: "relative bg-foreground text-background hover:bg-foreground/90 font-black italic skew-x-[-10deg] border-r-4 border-primary tracking-tighter sm:tracking-normal px-6 md:px-8",
      },
      size: {
        default: "h-11 px-4 py-2 [&_svg]:size-4",
        sm: "h-9 rounded-lg px-3 text-[10px] sm:text-xs [&_svg]:size-3.5",
        lg: "h-12 md:h-14 px-4 md:px-10 text-[11px] sm:text-base md:text-lg [&_svg]:size-4 sm:size-5",
        xl: "h-14 md:h-16 px-5 sm:px-8 md:px-12 text-xs sm:text-lg md:text-xl font-black [&_svg]:size-5 md:[&_svg]:size-6",
        icon: "h-10 w-10 md:h-12 md:w-12 [&_svg]:size-5 md:[&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isGaming = variant === "gaming";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isGaming && !asChild ? (
          <span className="flex items-center justify-center gap-1.5 sm:gap-2 skew-x-[10deg] w-full min-w-0">
            {children}
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
