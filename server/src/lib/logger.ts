type LogLevel = 'info' | 'warn' | 'error' | 'audit';

interface LogEntry {
  level: LogLevel;
  event: string;
  timestamp: string;
  [key: string]: unknown;
}

function formatLog(entry: LogEntry): string {
  return JSON.stringify(entry);
}

export const logger = {
  info(event: string, data: Record<string, unknown> = {}) {
    console.log(formatLog({
      level: 'info',
      event,
      timestamp: new Date().toISOString(),
      ...data,
    }));
  },

  warn(event: string, data: Record<string, unknown> = {}) {
    console.warn(formatLog({
      level: 'warn',
      event,
      timestamp: new Date().toISOString(),
      ...data,
    }));
  },

  error(event: string, error: Error | unknown, data: Record<string, unknown> = {}) {
    console.error(formatLog({
      level: 'error',
      event,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      ...data,
    }));
  },

  audit(event: string, data: Record<string, unknown> = {}) {
    console.log(formatLog({
      level: 'audit',
      event,
      timestamp: new Date().toISOString(),
      ...data,
    }));
  },
};

// Audit event types
export const AuditEvents = {
  AUTH_LOGIN_SUCCESS: 'auth.login.success',
  AUTH_LOGIN_FAILED: 'auth.login.failed',
  AUTH_REGISTER: 'auth.register',
  AUTH_LOGOUT: 'auth.logout',
  RESPONSE_GENERATED: 'response.generated',
  RESPONSE_APPROVED: 'response.approved',
  RESPONSE_EDITED: 'response.edited',
  REVIEW_STATUS_CHANGED: 'review.status.changed',
} as const;
