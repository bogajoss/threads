import { motion } from "motion/react";

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
    </motion.div>
  );
};

export default FeedHeader;
