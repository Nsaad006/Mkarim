// Helper function to get the full image URL
export const getImageUrl = (url: string): string => {
    // If it's already a full URL, return it
    if (url.startsWith('http')) return url;

    // If it's a relative path, prepend the backend URL
    // Use environment variable or default to localhost:3003
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    return `${backendUrl}${url}`;
};
