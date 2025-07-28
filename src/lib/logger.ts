
/**
 * Centralized logging utility for PlayScenarioAI
 * Provides consistent formatting and environment-based logging control
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'Auth' | 'Chat' | 'API' | 'UI' | 'Payment' | 'Scenario' | 'Character' | 'System';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';

  private formatMessage(level: LogLevel, category: LogCategory, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0]; // HH:MM:SS format
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${category}]`;
    
    if (context && Object.keys(context).length > 0) {
      return `${prefix} ${message} | Context: ${JSON.stringify(context)}`;
    }
    
    return `${prefix} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment && level !== 'error') {
      return false;
    }
    return true;
  }

  debug(category: LogCategory, message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) return;
    console.log(this.formatMessage('debug', category, message, context));
  }

  info(category: LogCategory, message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) return;
    console.info(this.formatMessage('info', category, message, context));
  }

  warn(category: LogCategory, message: string, context?: LogContext): void {
    if (!this.shouldLog('warn')) return;
    console.warn(this.formatMessage('warn', category, message, context));
  }

  error(category: LogCategory, message: string, error?: Error | any, context?: LogContext): void {
    if (!this.shouldLog('error')) return;
    
    const errorContext = error ? { 
      error: error.message || error,
      stack: error.stack,
      ...context 
    } : context;
    
    console.error(this.formatMessage('error', category, message, errorContext));
  }

  // Development-specific helper for debugging network requests
  debugNetwork(url: string, options?: RequestInit, response?: Response): void {
    if (!this.isDevelopment) return;
    
    console.group('🌐 Network Request');
    console.log('URL:', url);
    console.log('Options:', options);
    if (response) {
      console.log('Response Status:', response.status, response.statusText);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    }
    console.groupEnd();
  }
}

export const logger = new Logger();
