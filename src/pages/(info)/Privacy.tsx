import React from "react";

const Privacy: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Privacy Policy</h1>
      <p className="text-xl text-zinc-500">Last updated: February 7, 2026</p>
      
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, post content, or communicate with us.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. How We Use Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services, and to develop new features.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. Data Sharing</h2>
        <p>
          We do not share your personal information with third parties except as described in this policy or with your consent.
        </p>
      </section>
    </div>
  );
};

export default Privacy;
