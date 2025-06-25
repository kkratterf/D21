import { keys as analytics } from '@d21/analytics/keys';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    extends: [analytics()],
    server: {
        NOCODB_API_TOKEN: z.string(),
    },
    client: {},
    runtimeEnv: {
        NOCODB_API_TOKEN: process.env.NOCODB_API_TOKEN,
    },
});