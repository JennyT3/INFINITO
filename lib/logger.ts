/**
 * INFINITO Logger System
 * Professional logging with levels: DEBUG, INFO, WARN, ERROR
 * Following INFINITO rules for comprehensive error handling
 */

export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3
}

export interface LogEntry {
	timestamp: string;
	level: LogLevel;
	message: string;
	context?: string;
	data?: any;
	error?: Error;
	userId?: string;
	sessionId?: string;
	userAgent?: string;
	url?: string;
}

class InfinitoLogger {
	private currentLevel: LogLevel;
	private logs: LogEntry[] = [];
	private maxLogs: number = 1000;

	constructor(level: LogLevel = LogLevel.INFO) {
		this.currentLevel = level;
		
		// Initialize session tracking
		if (typeof window !== 'undefined') {
			this.initializeClientTracking();
		}
	}

	private initializeClientTracking() {
		// Generate session ID if not exists
		if (!sessionStorage.getItem('infinito_session_id')) {
			sessionStorage.setItem('infinito_session_id', this.generateSessionId());
		}
	}

	private generateSessionId(): string {
		return `INF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	private createLogEntry(level: LogLevel, message: string, context?: string, data?: any, error?: Error): LogEntry {
		const entry: LogEntry = {
			timestamp: new Date().toISOString(),
			level,
			message,
			context,
			data,
			error,
			userId: this.getCurrentUserId(),
			sessionId: this.getSessionId(),
			userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
			url: typeof window !== 'undefined' ? window.location.href : undefined
		};

		return entry;
	}

	private getCurrentUserId(): string | undefined {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('userEmail') || undefined;
		}
		return undefined;
	}

	private getSessionId(): string | undefined {
		if (typeof window !== 'undefined') {
			return sessionStorage.getItem('infinito_session_id') || undefined;
		}
		return undefined;
	}

	private shouldLog(level: LogLevel): boolean {
		return level >= this.currentLevel;
	}

	private formatConsoleMessage(entry: LogEntry): string {
		const timestamp = new Date(entry.timestamp).toLocaleTimeString();
		const levelStr = LogLevel[entry.level];
		const context = entry.context ? `[${entry.context}]` : '';
		
		return `🌱 INFINITO ${timestamp} ${levelStr} ${context} ${entry.message}`;
	}

	private getConsoleMethod(level: LogLevel): 'log' | 'info' | 'warn' | 'error' {
		switch (level) {
			case LogLevel.DEBUG: return 'log';
			case LogLevel.INFO: return 'info';
			case LogLevel.WARN: return 'warn';
			case LogLevel.ERROR: return 'error';
			default: return 'log';
		}
	}

	private logToConsole(entry: LogEntry) {
		if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
			return; // Skip console logging in production server
		}

		const method = this.getConsoleMethod(entry.level);
		const message = this.formatConsoleMessage(entry);

		if (entry.error) {
			console[method](message, entry.error);
		} else if (entry.data) {
			console[method](message, entry.data);
		} else {
			console[method](message);
		}
	}

	private storeLog(entry: LogEntry) {
		this.logs.push(entry);
		
		// Keep only the last maxLogs entries
		if (this.logs.length > this.maxLogs) {
			this.logs = this.logs.slice(-this.maxLogs);
		}

		// Store in localStorage for persistence (only last 100 entries)
		if (typeof window !== 'undefined') {
			try {
				const storedLogs = this.logs.slice(-100);
				localStorage.setItem('infinito_logs', JSON.stringify(storedLogs));
			} catch (error) {
				// Ignore localStorage errors
			}
		}
	}

	private log(level: LogLevel, message: string, context?: string, data?: any, error?: Error) {
		if (!this.shouldLog(level)) return;

		const entry = this.createLogEntry(level, message, context, data, error);
		
		this.logToConsole(entry);
		this.storeLog(entry);

		// Send to external logging service in production
		if (process.env.NODE_ENV === 'production' && level >= LogLevel.ERROR) {
			this.sendToExternalService(entry);
		}
	}

	private async sendToExternalService(entry: LogEntry) {
		// TODO: Implement external logging service (e.g., Sentry, LogRocket, etc.)
		try {
			// Example implementation
			if (typeof window !== 'undefined') {
				await fetch('/api/logs', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(entry)
				});
			}
		} catch (error) {
			// Silently fail external logging
		}
	}

	// Public logging methods
	debug(message: string, context?: string, data?: any) {
		this.log(LogLevel.DEBUG, message, context, data);
	}

	info(message: string, context?: string, data?: any) {
		this.log(LogLevel.INFO, message, context, data);
	}

	warn(message: string, context?: string, data?: any) {
		this.log(LogLevel.WARN, message, context, data);
	}

	error(message: string, context?: string, error?: Error, data?: any) {
		this.log(LogLevel.ERROR, message, context, data, error);
	}

	// Specialized logging methods
	apiError(method: string, url: string, status: number, error: Error, data?: any) {
		this.error(
			`API Error: ${method} ${url} - Status: ${status}`,
			'API',
			error,
			{ method, url, status, ...data }
		);
	}

	authError(action: string, error: Error, data?: any) {
		this.error(
			`Authentication Error: ${action}`,
			'AUTH',
			error,
			{ action, ...data }
		);
	}

	validationError(field: string, message: string, data?: any) {
		this.warn(
			`Validation Error: ${field} - ${message}`,
			'VALIDATION',
			{ field, message, ...data }
		);
	}

	performanceLog(action: string, duration: number, data?: any) {
		this.info(
			`Performance: ${action} took ${duration}ms`,
			'PERFORMANCE',
			{ action, duration, ...data }
		);
	}

	userAction(action: string, data?: any) {
		this.info(
			`User Action: ${action}`,
			'USER',
			data
		);
	}

	// Utility methods
	setLevel(level: LogLevel) {
		this.currentLevel = level;
	}

	getLogs(level?: LogLevel): LogEntry[] {
		if (level === undefined) {
			return [...this.logs];
		}
		return this.logs.filter(log => log.level >= level);
	}

	clearLogs() {
		this.logs = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem('infinito_logs');
		}
	}

	exportLogs(): string {
		return JSON.stringify(this.logs, null, 2);
	}

	getLogStats() {
		const stats = {
			total: this.logs.length,
			debug: 0,
			info: 0,
			warn: 0,
			error: 0
		};

		this.logs.forEach(log => {
			switch (log.level) {
				case LogLevel.DEBUG: stats.debug++; break;
				case LogLevel.INFO: stats.info++; break;
				case LogLevel.WARN: stats.warn++; break;
				case LogLevel.ERROR: stats.error++; break;
			}
		});

		return stats;
	}
}

// Create singleton instance
export const logger = new InfinitoLogger(
	process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);

// Export for external use
export default logger; 