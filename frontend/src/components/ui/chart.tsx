import { cn } from "@/lib/utils";
import * as React from "react";

export interface ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  };
}

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ReactNode;
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn("w-full", className)}
      style={
        {
          "--chart-1": config.desktop?.color || "hsl(var(--primary))",
          "--chart-2": config.mobile?.color || "hsl(var(--primary))",
          "--chart-3": config.visitors?.color || "hsl(var(--primary))",
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}

export interface ChartTooltipProps {
  cursor?: boolean;
  content?: React.ReactNode;
}

export function ChartTooltip({ cursor = true, content }: ChartTooltipProps) {
  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      {content}
    </div>
  );
}

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  labelFormatter?: (value: string) => string;
  indicator?: "line" | "dot" | "dashed";
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  indicator = "dot",
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">
        {labelFormatter ? labelFormatter(label || "") : label}
      </div>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.name}: {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
