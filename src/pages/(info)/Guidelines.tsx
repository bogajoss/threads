import React from "react";

const Guidelines: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Community Guidelines
      </h1>
      <p className="text-xl text-zinc-500">
        How we keep Sysm safe and welcoming.
      </p>

      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">1. Be Respectful</h2>
        <p>
          Treat others with respect. Harassment, bullying, and hate speech are
          strictly prohibited.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. Share Authentic Content</h2>
        <p>
          Don't impersonate others or share misleading information. Be yourself.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. No Spam</h2>
        <p>
          Keep the community clean. Avoid excessive self-promotion or repetitive
          content.
        </p>
      </section>
    </div>
  );
};

export default Guidelines;
