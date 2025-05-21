import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border-2 border-primary/25 bg-card text-card-foreground shadow-ornate backdrop-filter backdrop-blur-sm bg-opacity-75 transition-all duration-300 ease-out hover:shadow-primary/20", // Enhanced thematic styling
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
    className={cn("flex flex-col space-y-1.5 p-5 border-b-2 border-primary/20 bg-secondary/40", className)} // Thematic header
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement> 
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "text-2xl font-lora font-semibold leading-tight tracking-wide text-primary", // Thematic title, adjusted leading
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn("text-sm text-muted-foreground font-serif italic pt-1", className)} // Thematic description, added pt-1
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 text-foreground/90", className)} {...props} /> // Maintained padding
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 border-t-2 border-primary/20 bg-secondary/30", className)} // Thematic footer
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
