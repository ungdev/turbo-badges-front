/**
 * Logger centralisé pour l'application
 * 
 * Remplace l'utilisation directe de console.log/warn/error
 * Les logs sont désactivés en production pour éviter de fuiter des informations sensibles
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
    context?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Formate un message de log avec contexte
 */
function formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}]` : '';
    return `[${timestamp}] ${level.toUpperCase()} ${context} ${message}`;
}

/**
 * Logger principal
 */
export const logger = {
    /**
     * Log de debug (dev only)
     */
    debug: (message: string, options?: LogOptions) => {
        if (isDevelopment || isTest) {
            const formatted = formatMessage('debug', message, options);
            console.log(formatted, options?.metadata || '');
        }
    },

    /**
     * Log d'information (dev only)
     */
    info: (message: string, options?: LogOptions) => {
        if (isDevelopment || isTest) {
            const formatted = formatMessage('info', message, options);
            console.info(formatted, options?.metadata || '');
        }
    },

    /**
     * Log de warning (dev & test only)
     */
    warn: (message: string, options?: LogOptions) => {
        if (isDevelopment || isTest) {
            const formatted = formatMessage('warn', message, options);
            console.warn(formatted, options?.metadata || '');
        }
    },

    /**
     * Log d'erreur (always)
     */
    error: (message: string, error?: Error | unknown, options?: LogOptions) => {
        const formatted = formatMessage('error', message, options);

        if (isDevelopment || isTest) {
            console.error(formatted, error, options?.metadata || '');
        } else {
            console.error(formatted);
        }
    },

    /**
     * Log de succès (dev only)
     */
    success: (message: string, options?: LogOptions) => {
        if (isDevelopment || isTest) {
            const formatted = formatMessage('info', `✓ ${message}`, options);
            console.log(formatted, options?.metadata || '');
        }
    },
};

/**
 * Hook React pour logger avec contexte automatique
 * 
 * @example
 * const log = useLogger('MyComponent');
 * log.info('Composant monté');
 */
export function createContextLogger(context: string) {
    return {
        debug: (message: string, metadata?: Record<string, unknown>) =>
            logger.debug(message, { context, metadata }),
        info: (message: string, metadata?: Record<string, unknown>) =>
            logger.info(message, { context, metadata }),
        warn: (message: string, metadata?: Record<string, unknown>) =>
            logger.warn(message, { context, metadata }),
        error: (message: string, error?: Error | unknown, metadata?: Record<string, unknown>) =>
            logger.error(message, error, { context, metadata }),
        success: (message: string, metadata?: Record<string, unknown>) =>
            logger.success(message, { context, metadata }),
    };
}

export default logger;
