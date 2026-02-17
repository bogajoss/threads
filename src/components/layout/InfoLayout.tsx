import React from "react";
import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const InfoLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-violet-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/feed"
            className="flex items-center gap-2 text-zinc-500 transition-colors hover:text-black dark:hover:text-white"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Feed</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.webp" alt="Logo" className="size-8 rounded-lg" />
            <span className="text-xl font-bold tracking-tight">Sysm</span>
          </Link>
          <div className="w-20" /> {/* Spacer for balance */}
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-black dark:text-white">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-zinc-500 hover:text-violet-500"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-zinc-500 hover:text-violet-500"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guidelines"
                    className="text-sm text-zinc-500 hover:text-violet-500"
                  >
                    Guidelines
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-black dark:text-white">
                Support
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/support"
                    className="text-sm text-zinc-500 hover:text-violet-500"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/status"
                    className="text-sm text-zinc-500 hover:text-violet-500"
                  >
                    System Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-black dark:text-white">
                Community
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="https://discord.gg/sysm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-500 hover:text-violet-500"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/sysm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-500 hover:text-violet-500"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-black dark:text-white">
                Social
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/feed"
                    className="text-sm text-zinc-500 hover:text-violet-500"
                  >
                    Threads
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">
              © 2026 Sysm. All rights reserved. Built with passion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InfoLayout;
