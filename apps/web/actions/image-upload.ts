/**
 * Uploads an image from a URL to Postimages.org using their official API
 * @param imageUrl - The URL of the image to upload
 * @returns The URL of the image on Postimages.org
 */
export async function uploadImageToPostimages(imageUrl: string): Promise<string> {
    try {
        // Enhanced URL validation
        if (!imageUrl || !imageUrl.startsWith('http')) {
            throw new Error('Invalid URL');
        }

        // Validate URL format and security
        const url = new URL(imageUrl);

        // Check protocol
        if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error('Invalid URL protocol');
        }

        // Block potentially malicious domains
        const blockedDomains = [
            'localhost',
            '127.0.0.1',
            '0.0.0.0',
            '::1',
            'file://',
            'ftp://',
            'data:',
            'javascript:',
            'vbscript:',
            'onload=',
            'onerror='
        ];

        const isBlocked = blockedDomains.some(blocked =>
            url.hostname.includes(blocked) ||
            url.href.toLowerCase().includes(blocked)
        );

        if (isBlocked) {
            throw new Error('URL not allowed for security reasons');
        }

        // Validate image file extension
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const hasValidExtension = allowedExtensions.some(ext =>
            url.pathname.toLowerCase().endsWith(ext)
        );

        if (!hasValidExtension) {
            throw new Error('Invalid image format. Supported: JPG, PNG, GIF, WebP, SVG');
        }

        // Check file size before upload (HEAD request)
        try {
            const headResponse = await fetch(imageUrl, {
                method: 'HEAD',
                signal: AbortSignal.timeout(10000), // 10 second timeout
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; ImageValidator/1.0)'
                }
            });

            if (!headResponse.ok) {
                throw new Error('Cannot access image URL');
            }

            const contentLength = headResponse.headers.get('content-length');
            const contentType = headResponse.headers.get('content-type');

            // Check file size (max 10MB)
            if (contentLength && Number.parseInt(contentLength) > 10 * 1024 * 1024) {
                throw new Error('Image file too large. Maximum size: 10MB');
            }

            // Validate content type
            if (contentType && !contentType.startsWith('image/')) {
                throw new Error('URL does not point to a valid image file');
            }

        } catch (error) {
            console.warn('Could not validate image size/type:', error);
            // Continue anyway, Postimages.org will handle validation
        }

        // Generate upload_session as in the original JavaScript
        const uploadSession = new Date().getTime() + Math.random().toString().substring(1);

        // Prepare data for upload to Postimages.org
        const formData = new FormData();
        formData.append('upload_session', uploadSession);
        formData.append('url', imageUrl);
        formData.append('numfiles', '1');
        formData.append('optsize', '0'); // No resize
        formData.append('expire', '0'); // No expiration
        formData.append('gallery', ''); // Empty gallery

        // Upload the image to Postimages.org using their official API
        const uploadResponse = await fetch('https://postimages.org/json/rr', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            // Add timeout to prevent hanging requests
            signal: AbortSignal.timeout(30000) // 30 seconds timeout
        });

        if (!uploadResponse.ok) {
            console.error('Response status:', uploadResponse.status);
            const errorText = await uploadResponse.text();
            console.error('Response body:', errorText);
            throw new Error(`Error uploading to Postimages.org: ${uploadResponse.status}`);
        }

        const uploadResult = await uploadResponse.json();
        console.log('Upload result:', uploadResult);

        if (uploadResult.status_code !== 200) {
            console.error('Response from Postimages.org:', uploadResult);
            throw new Error(`Error from Postimages.org: ${uploadResult.error?.message || 'Unknown error'}`);
        }

        // Postimages.org returns both 'url' (page) and 'image' (direct URL)
        // We prefer the direct image URL if available
        const resultUrl = uploadResult.image || uploadResult.url;

        if (!resultUrl) {
            console.error('Response from Postimages.org:', uploadResult);
            throw new Error('Invalid response from Postimages.org - missing URL');
        }

        // If we have the page URL, convert it to direct URL
        if (resultUrl.includes('postimg.cc/') && !resultUrl.includes('i.postimg.cc/')) {
            // Extract the ID from the page URL and build the direct URL
            const match = resultUrl.match(/postimg\.cc\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/);
            if (match) {
                const [, id1, id2] = match;
                return `https://i.postimg.cc/${id1}/${id2}.jpg`;
            }
        }

        // Return the direct image URL
        return resultUrl;

    } catch (error) {
        console.error('Error uploading image:', error);

        // Provide more specific error messages without exposing internals
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('Image upload timed out. Please try again.');
            }
            if (error.message.includes('fetch')) {
                throw new Error('Unable to reach image hosting service. Please try again later.');
            }
            // Return the original error message for validation errors
            if (error.message.includes('Invalid') || error.message.includes('not allowed') || error.message.includes('too large')) {
                throw error;
            }
        }

        throw new Error('Failed to process image. Please check the URL and try again.');
    }
}

/**
 * Checks if a URL is already a supported image hosting service URL
 */
export function isImageHostingUrl(url: string): boolean {
    return url.includes('postimg.cc') ||
        url.includes('postimages.org') ||
        url.includes('i.imgur.com') ||
        url.includes('imageshack.com') ||
        url.includes('imgbb.com');
}

/**
 * Validates image URL before processing
 */
export function validateImageUrl(url: string): { isValid: boolean; error?: string } {
    if (!url || url.trim() === '') {
        return { isValid: false, error: 'URL is required' };
    }

    try {
        const urlObj = new URL(url);

        // Check protocol
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return { isValid: false, error: 'Invalid URL protocol' };
        }

        // Check for blocked domains
        const blockedDomains = [
            'localhost',
            '127.0.0.1',
            '0.0.0.0',
            '::1',
            'file://',
            'ftp://',
            'data:',
            'javascript:',
            'vbscript:',
            'onload=',
            'onerror='
        ];

        const isBlocked = blockedDomains.some(blocked =>
            urlObj.hostname.includes(blocked) ||
            urlObj.href.toLowerCase().includes(blocked)
        );

        if (isBlocked) {
            return { isValid: false, error: 'URL not allowed for security reasons' };
        }

        // Check file extension
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const hasValidExtension = allowedExtensions.some(ext =>
            urlObj.pathname.toLowerCase().endsWith(ext)
        );

        if (!hasValidExtension) {
            return { isValid: false, error: 'Invalid image format. Supported: JPG, PNG, GIF, WebP, SVG' };
        }

        return { isValid: true };
    } catch {
        return { isValid: false, error: 'Invalid URL format' };
    }
}

/**
 * Processes an image URL: if it's not already on a supported hosting service, uploads it automatically
 */
export async function processImageUrl(imageUrl: string): Promise<string> {
    if (!imageUrl || imageUrl.trim() === '') {
        return '';
    }

    // Validate the URL first
    const validation = validateImageUrl(imageUrl);
    if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid image URL');
    }

    // If it's already a supported image hosting service URL, return it as is
    if (isImageHostingUrl(imageUrl)) {
        return imageUrl;
    }

    // Otherwise, upload it to Postimages.org
    return await uploadImageToPostimages(imageUrl);
} 