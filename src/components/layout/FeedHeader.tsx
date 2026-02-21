import { motion } from "framer-motion";

const FeedHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="group relative mb-6 aspect-[21/9] w-full cursor-pointer overflow-hidden rounded-3xl sm:aspect-[2.5/1] active:scale-[0.98] transition-transform duration-200"
    >
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
          Welcome to MySys
        </h1>
        <p className="tracking-wide text-sm font-medium opacity-90 drop-shadow-md sm:text-base">
          a social network built by{" "}
          <a
            href="https://t.me/systemadminbd"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            @Systemadminbd
          </a>
        </p>
      </div>

      <div className="absolute bottom-4 right-8">
        <motion.img
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          src="/logo.webp"
          className="size-12 rounded-xl opacity-80"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </motion.div>
  );
};

export default FeedHeader;
