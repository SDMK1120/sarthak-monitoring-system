type LogContext = Record<string, string | number | boolean | undefined>;

function safeContext(context: LogContext): LogContext {
  return Object.fromEntries(Object.entries(context).filter(([key]) => !/token|secret|password|authorization|cookie|database/i.test(key)));
}

export const logger = {
  info(message: string, context: LogContext = {}) {
    if (import.meta.env.DEV) console.info(message, safeContext(context));
  },
  error(message: string, context: LogContext = {}) {
    console.error(message, safeContext(context));
  },
};
