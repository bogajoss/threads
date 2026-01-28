import React from "react";
import { Helmet } from "react-helmet-async";

const SEOHead = ({ title, description, image, url, type = "website" }) => {
  const siteName = "Sysm";
  const defaultDescription = "A modern social network built for community engagement and seamless communication.";
  
  // Logic for determining the OG Image
  let dynamicImage;

  if (image) {
    // 1. If a specific image is provided (e.g. post media, user avatar), use it.
    dynamicImage = image;
  } else if (title === "Home" || title === "Home Feed") {
    // 2. If it's the Home page, use the static welcome banner.
    dynamicImage = "/welcome-banner.webp"; // Ensure this path is correct relative to your public folder
  } else {
    // 3. For text-only posts or other pages, use the dynamic text card generator.
    // Using a reliable public OG generator style.
    const textToDisplay = title ? encodeURIComponent(title.replace(` | ${siteName}`, '')) : encodeURIComponent(siteName);
    dynamicImage = `https://og-image.vercel.app/${textToDisplay}.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-white.svg`;
  }

  const metaTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;
  const metaUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={dynamicImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={dynamicImage} />
    </Helmet>
  );
};

export default SEOHead;
