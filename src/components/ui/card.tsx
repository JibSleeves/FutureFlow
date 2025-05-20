import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border-2 border-primary/20 bg-card text-card-foreground shadow-xl backdrop-filter backdrop-blur-sm bg-opacity-70", // Enhanced thematic styling
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 border-b-2 border-primary/10 bg-secondary/30", className)} // Thematic header
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement, // Changed from HTMLParagraphElement to HTMLDivElement
  React.HTMLAttributes<HTMLDivElement> // Changed from HTMLHeadingElement to HTMLDivElement
>(({ className, ...props }, ref) => (
  <div // Changed from h3 to div to allow more flexible content (e.g. flex items)
    ref={ref}
    className={cn(
      "text-2xl font-lora font-semibold leading-none tracking-tight text-primary", // Thematic title
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement, // Changed from HTMLParagraphElement to HTMLDivElement
  React.HTMLAttributes<HTMLDivElement> // Changed from HTMLParagraphElement to HTMLDivElement
>(({ className, ...props }, ref) => (
  <div // Changed from p to div
    ref={ref}
    className={cn("text-sm text-muted-foreground font-serif italic", className)} // Thematic description
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-4 text-foreground/90", className)} {...props} /> // Adjusted padding
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0 border-t-2 border-primary/10 bg-secondary/20", className)} // Thematic footer
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
