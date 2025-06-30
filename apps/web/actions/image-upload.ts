/**
 * Uploads an image from a URL to Postimages.org using their official API
 * @param imageUrl - The URL of the image to upload
 * @returns The URL of the image on Postimages.org
 */
export async function uploadImageToPostimages(imageUrl: string): Promise<string> {
    try {
        // Verify that the URL is valid
        if (!imageUrl || !imageUrl.startsWith('http')) {
            throw new Error('Invalid URL');
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
            }
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
        throw new Error(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
 * Processes an image URL: if it's not already on a supported hosting service, uploads it automatically
 */
export async function processImageUrl(imageUrl: string): Promise<string> {
    if (!imageUrl || imageUrl.trim() === '') {
        return '';
    }

    // If it's already a supported image hosting service URL, return it as is
    if (isImageHostingUrl(imageUrl)) {
        return imageUrl;
    }

    // Otherwise, upload it to Postimages.org
    return await uploadImageToPostimages(imageUrl);
} 