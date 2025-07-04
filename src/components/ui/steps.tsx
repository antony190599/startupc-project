import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  description?: string
}

interface StepsProps {
  steps: Step[]
  currentStep: number
  className?: string
}

const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  ({ steps, currentStep, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        <div className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isUpcoming = index > currentStep

            return (
              <div key={step.id} className="flex flex-col items-center relative">
                {/* Step circle */}
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors z-10 bg-background",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-background text-primary",
                    isUpcoming &&
                      "border-muted-foreground/25 bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 bg-muted-foreground/25 -z-10" />
                )}
                
                {/* Step title */}
                <div className="mt-2 text-center px-1">
                  <div
                    className={cn(
                      "text-xs font-medium leading-tight",
                      isCompleted && "text-primary",
                      isCurrent && "text-primary",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
Steps.displayName = "Steps"

export { Steps } 