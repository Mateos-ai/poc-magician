import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        accent: "border-teal-200 bg-teal-50 text-teal-800",
        outline: "border-border bg-card text-muted-foreground",
        success: "border-[#bfe9d4] bg-[#E6F8EF] text-[#0f7a4d]",
        warning: "border-[#f6dca6] bg-[#FFF4E0] text-[#9a6608]",
        destructive: "border-[#f3c4c6] bg-[#FCE9EA] text-[#b3262b]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
