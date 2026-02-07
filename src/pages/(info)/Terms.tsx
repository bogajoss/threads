import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Terms of Service</h1>
      <p className="text-xl text-zinc-500">Last updated: February 7, 2026</p>
      
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Sysm, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. User Conduct</h2>
        <p>
          You are responsible for your use of Sysm and for any content you provide. You agree to use the service in compliance with all applicable laws and regulations.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. Content</h2>
        <p>
          You retain your rights to any content you submit, post or display on or through the services. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license.
        </p>
      </section>
    </div>
  );
};

export default Terms;
