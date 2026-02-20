import React from "react";
import { Mail, MessageSquare, ExternalLink } from "lucide-react";

const Support: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Support Center
        </h1>
        <p className="text-xl text-zinc-500">
          We're here to help you with anything on mysys.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-800">
          <Mail className="mb-4 text-violet-500" size={32} />
          <h2 className="text-xl font-bold">Email Us</h2>
          <p className="mt-2 text-zinc-500">
            Our team typically responds within 24 hours.
          </p>
          <a
            href="mailto:support@mysys.com"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-500 hover:underline"
          >
            support@mysys.com <ExternalLink size={14} />
          </a>
        </div>

        <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-800">
          <MessageSquare className="mb-4 text-violet-500" size={32} />
          <h2 className="text-xl font-bold">Community Support</h2>
          <p className="mt-2 text-zinc-500">
            Join our Discord for real-time help from the community.
          </p>
          <a
            href="https://discord.gg/mysys"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-500 hover:underline"
          >
            Join Discord <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <section className="space-y-4 pt-8">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-black dark:text-white">
              How do I reset my password?
            </h3>
            <p className="mt-1 text-zinc-500">
              You can reset your password from the login page by clicking
              "Forgot Password".
            </p>
          </div>
          <div>
            <h3 className="font-bold text-black dark:text-white">
              Is mysys free to use?
            </h3>
            <p className="mt-1 text-zinc-500">
              Yes, the core features of mysys are free. We also offer a Pro
              subscription for advanced features.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;
