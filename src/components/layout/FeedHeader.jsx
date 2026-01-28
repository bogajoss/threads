import React from "react";

const FeedBanner = () => {
  return (
    <div className="relative w-full aspect-[21/9] sm:aspect-[2.5/1] rounded-3xl overflow-hidden mb-6 group cursor-pointer">
      <img
        src="/welcome-banner.webp"
        alt="Welcome Banner"
        fetchpriority="high"
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <div className="absolute bottom-6 left-8 text-white">
        <h1 className="text-3xl sm:text-4xl font-black mb-1 drop-shadow-lg">
          Welcome to Sysm
        </h1>
        <p className="text-sm sm:text-base font-medium opacity-90 tracking-wide drop-shadow-md">
          a social network built by{" "}
          <a
            href="https://t.me/systemadminbd"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            @Systemadminbd
          </a>
        </p>
      </div>

      {/* Floating Icons/Sparkles to match image feel */}
      <div className="absolute bottom-4 right-8">
        <img
          src="/logo.webp"
          className="size-12 animate-pulse opacity-80 rounded-xl"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default FeedBanner;
