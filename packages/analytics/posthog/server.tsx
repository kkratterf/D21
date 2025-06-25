import 'server-only';
import { PostHog } from 'posthog-node';
import { keys } from '../keys';

// Check if we're in a real server environment where env vars would be accessible
let analytics: PostHog | null = null;

// Safely create the analytics instance only if env vars are available
try {
    const envKeys = keys();
    if (envKeys.NEXT_PUBLIC_POSTHOG_KEY && envKeys.NEXT_PUBLIC_POSTHOG_HOST) {
        analytics = new PostHog(envKeys.NEXT_PUBLIC_POSTHOG_KEY, {
            host: envKeys.NEXT_PUBLIC_POSTHOG_HOST,
            flushAt: 1,
            flushInterval: 0,
        });
    }
} catch (error) {
    // Silent error during build - env vars might not be available
    console.warn('PostHog server analytics initialization skipped');
}

export { analytics };
