import * as React from "react"

export interface ToastProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	children: React.ReactNode
}

export function Toast({ open, onOpenChange, children }: ToastProps) {
	if (!open) return null;
	return (
		<div className="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4">
			{children}
		</div>
	);
}

export type ToastActionElement = React.ReactElement 