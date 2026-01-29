/**
 * Fetches and parses Open Graph metadata from a URL using a CORS proxy.
 */
export const getLinkPreview = async (url: string) => {
    try {
        // We use allorigins proxy to bypass CORS
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`

        const response = await fetch(proxyUrl)
        if (!response.ok) throw new Error("Failed to fetch preview")

        const html = await response.text()
        const doc = new DOMParser().parseFromString(html, "text/html")

        // Helper to get meta content
        const getMeta = (property: string) => {
            return (
                doc
                    .querySelector(`meta[property="${property}"]`)
                    ?.getAttribute("content") ||
                doc.querySelector(`meta[name="${property}"]`)?.getAttribute("content")
            )
        }

        // Extract basic data
        const data = {
            title: getMeta("og:title") || doc.title || url,
            description: getMeta("og:description") || getMeta("description") || "",
            image: getMeta("og:image") || getMeta("twitter:image") || "",
            siteName: getMeta("og:site_name") || new URL(url).hostname,
            url: url,
        }

        return data
    } catch (error) {
        console.error("Link preview error:", error)
        return null
    }
}

/**
 * Extracts the first URL from a string of text.
 */
export const extractUrl = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const match = text.match(urlRegex)
    return match ? match[0] : null
}
