import React from "react";
import { Helmet } from "react-helmet-async";

const SEOHead = ({ title, description, image, url, type = "website" }) => {
  const siteName = "Sysm";
  const defaultDescription = "A modern social network built for community engagement and seamless communication.";
  
  // Construct a dynamic OG image URL if no specific image is provided
  // We use a high-quality open source generator to mimic the "beautiful" card style
  // In a real production app with Vercel/Next.js, you'd point this to /api/og
  const dynamicImage = image || `https://og-image.vercel.app/${encodeURIComponent(title || siteName)}.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-white.svg`;

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
