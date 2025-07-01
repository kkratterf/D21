/**
 * Secure error handling to prevent information disclosure
 */

// Error types that are safe to expose to users
const SAFE_ERROR_MESSAGES = {
    // Authentication errors
    'Not authenticated': 'Please log in to continue',
    'Authentication required': 'Please log in to continue',
    'Invalid credentials': 'Invalid email or password',

    // Validation errors
    'Invalid URL': 'Please provide a valid URL',
    'Invalid email': 'Please provide a valid email address',
    'Invalid image format': 'Please provide a valid image (JPG, PNG, GIF, WebP, SVG)',
    'Image file too large': 'Image file is too large. Maximum size: 10MB',
    'URL not allowed': 'This URL is not allowed for security reasons',
    'Invalid URL protocol': 'Please provide a valid HTTP or HTTPS URL',
    'Cannot access image URL': 'Cannot access the provided image URL',
    'URL does not point to a valid image file': 'The URL does not point to a valid image',

    // Business logic errors
    'Directory not found': 'Directory not found',
    'Startup not found': 'Startup not found',
    'You do not have access to this directory': 'You do not have access to this directory',
    'Slug already exists': 'This name is already taken. Please choose a different one',

    // Rate limiting
    'Rate limit exceeded': 'Too many requests. Please wait a moment before trying again',

    // Generic errors
    'Invalid form data': 'Please check your input and try again',
    'Failed to process image': 'Failed to process image. Please check the URL and try again',
    'Image upload timed out': 'Image upload timed out. Please try again',
    'Unable to reach image hosting service': 'Unable to reach image hosting service. Please try again later',
};

// Error types that should be logged but not exposed
const SENSITIVE_ERROR_PATTERNS = [
    /sql/i,
    /database/i,
    /prisma/i,
    /connection/i,
    /timeout/i,
    /network/i,
    /fetch/i,
    /internal/i,
    /stack/i,
    /trace/i,
    /debug/i,
    /error:/i,
    /exception/i,
    /undefined/i,
    /null/i,
    /object/i,
    /function/i,
    /process\.env/i,
    /NEXT_PUBLIC/i,
    /SUPABASE/i,
    /POSTGRES/i,
];

/**
 * Sanitizes error messages to prevent information disclosure
 */
export function sanitizeError(error: unknown): string {
    if (!error) {
        return 'An unexpected error occurred';
    }

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Check if it's a safe error message
    if (SAFE_ERROR_MESSAGES[errorMessage as keyof typeof SAFE_ERROR_MESSAGES]) {
        return SAFE_ERROR_MESSAGES[errorMessage as keyof typeof SAFE_ERROR_MESSAGES];
    }

    // Check if it contains sensitive information
    const containsSensitiveInfo = SENSITIVE_ERROR_PATTERNS.some(pattern =>
        pattern.test(errorMessage)
    );

    if (containsSensitiveInfo) {
        console.error('Sensitive error intercepted:', errorMessage);
        return 'An unexpected error occurred. Please try again.';
    }

    // For other errors, return a generic message
    return 'An unexpected error occurred. Please try again.';
}

/**
 * Logs errors securely without exposing sensitive information
 */
export function logError(error: unknown, context?: string): void {
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stackTrace = error instanceof Error ? error.stack : undefined;

    // Log to console in development, but not in production
    if (process.env.NODE_ENV === 'development') {
        console.error(`[${timestamp}] Error${context ? ` in ${context}` : ''}:`, {
            message: errorMessage,
            stack: stackTrace,
            error: error
        });
    } else {
        // In production, log minimal information
        console.error(`[${timestamp}] Error${context ? ` in ${context}` : ''}: ${errorMessage}`);
    }
}

/**
 * Handles errors in server actions
 */
export function handleServerActionError(error: unknown, actionName: string): { success: false; message: string } {
    logError(error, actionName);

    return {
        success: false,
        message: sanitizeError(error)
    };
}

/**
 * Wraps async functions with error handling
 */
export function withErrorHandling<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    context: string
): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
        try {
            return await fn(...args);
        } catch (error) {
            logError(error, context);
            throw new Error(sanitizeError(error));
        }
    };
} 