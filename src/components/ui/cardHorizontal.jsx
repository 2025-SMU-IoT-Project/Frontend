import * as React from "react";
import { cn } from "../../lib/utils";

const CardHorizontal = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-xl border bg-card text-card-foreground shadow",
            className,
        )}
        {...props}
    />
));
CardHorizontal.displayName = "CardHorizontal";

const CardHorizontalHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHorizontalHeader.displayName = "CardHorizontalHeader";

const CardHorizontalTitle = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
CardHorizontalTitle.displayName = "CardHorizontalTitle";

const CardHorizontalDescription = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardHorizontalDescription.displayName = "CardHorizontalDescription";

const CardHorizontalContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardHorizontalContent.displayName = "CardHorizontalContent";

const CardHorizontalFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardHorizontalFooter.displayName = "CardHorizontalFooter";

export {
    CardHorizontal,
    CardHorizontalHeader,
    CardHorizontalFooter,
    CardHorizontalTitle,
    CardHorizontalDescription,
    CardHorizontalContent,
};
