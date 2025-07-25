"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
	value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value = 0, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"relative w-full h-4 rounded-full bg-gradient-to-r from-[#EDE4DA] to-[#43B2D2] shadow-lg overflow-hidden border border-[#EDE4DA] backdrop-blur-md",
			className
		)}
		{...props}
	>
		<div
			className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#689610] via-[#3E88FF] to-[#D42D66] transition-all duration-500 filter drop-shadow"
			style={{ width: `${value}%` }}
		/>
		<div className="absolute inset-0 opacity-10 bg-[url('/Fondo.png')] bg-cover bg-center pointer-events-none" />
	</div>
))
Progress.displayName = "Progress"
export { Progress } 