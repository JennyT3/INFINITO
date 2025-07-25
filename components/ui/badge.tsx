"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	color?: "green" | "blue" | "pink" | "yellow" | "orange" | "cyan" | "purple"
}

const colorMap = {
	green: "bg-[#689610] text-white",
	blue: "bg-[#3E88FF] text-white",
	pink: "bg-[#D42D66] text-white",
	yellow: "bg-[#EAB308] text-black",
	orange: "bg-[#F47802] text-white",
	cyan: "bg-[#43B2D2] text-white",
	purple: "bg-[#813684] text-white",
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, color = "green", ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wider shadow-md border border-[#EDE4DA] backdrop-blur-sm",
			colorMap[color],
			className
		)}
		{...props}
	/>
))
Badge.displayName = "Badge"
export { Badge }