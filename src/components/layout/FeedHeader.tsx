const FeedHeader = () => {
  return (
    <div className="group relative mb-6 aspect-[21/9] w-full cursor-pointer overflow-hidden rounded-3xl sm:aspect-[2.5/1]">
      <img
        src="/welcome-banner.webp"
        alt="Welcome Banner"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <div className="absolute bottom-6 left-8 text-white">
        <h1 className="mb-1 text-3xl font-black drop-shadow-lg sm:text-4xl">
          Welcome to Sysm
        </h1>
        <p className="tracking-wide text-sm font-medium opacity-90 drop-shadow-md sm:text-base">
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

      <div className="absolute bottom-4 right-8">
        <img
          src="/logo.webp"
          className="size-12 animate-pulse rounded-xl opacity-80"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default FeedHeader;
