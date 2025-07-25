"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
	<input
		type={type}
		className={cn(
			"flex h-12 w-full rounded-xl border border-[#EDE4DA] bg-white/80 px-4 py-2 text-base font-light shadow-inner ring-offset-background placeholder:text-[#689610]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43B2D2] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-md",
			className
		)}
		ref={ref}
		{...props}
	/>
))
Input.displayName = "Input"
export { Input }