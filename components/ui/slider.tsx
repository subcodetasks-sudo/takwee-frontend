import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"

type SliderProps = SliderPrimitive.Root.Props & {
  /** Accessible name for each thumb (required for range sliders). */
  thumbLabels?: string[]
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabels,
  ...props
}: SliderProps) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow rounded-full bg-muted select-none data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="rounded-full bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
          {Array.from({ length: _values.length }, (_, index) => (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={index}
              index={index}
              aria-label={thumbLabels?.[index]}
              className={cn(
                "relative block size-4 shrink-0 rounded-full border-2 border-primary bg-background shadow-sm",
                "ring-ring/40 transition-[color,box-shadow,transform] select-none",
                "after:absolute after:-inset-2",
                "hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 active:scale-105",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
