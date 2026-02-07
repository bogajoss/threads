import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="relative mb-8">
        <h1 className="text-9xl font-black tracking-tighter text-zinc-100 dark:text-zinc-900">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-white p-4 shadow-2xl dark:bg-zinc-800">
            <Search size={48} className="text-violet-500 animate-pulse" />
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
        Page not found
      </h2>
      
      <p className="mt-4 max-w-md text-lg text-zinc-500">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          to="/feed"
          className="flex items-center justify-center gap-2 rounded-full bg-black px-8 py-3 font-bold text-white transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
        >
          <Home size={20} />
          Back to Feed
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3 font-bold text-black transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:bg-zinc-900"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
      </div>

      <div className="mt-12">
        <p className="text-sm text-zinc-400">
          Think this is a mistake? <Link to="/support" className="text-violet-500 hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
