import React from "react";
import { PageTransition } from "@/components/layout";
import Button from "@/components/ui/Button";

const ProPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background gap-10 py-10">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes flow {
            to {
              stroke-dashoffset: 0;
            }
          }
          .trace-flow {
            stroke-dasharray: 40 400;
            stroke-dashoffset: 438;
            animation: flow 3s cubic-bezier(0.5, 0, 0.9, 1) infinite;
          }
        `,
          }}
        />
        <div className="w-full max-w-2xl">
          <svg
            viewBox="0 0 800 500"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full drop-shadow-2xl"
          >
            <defs>
              <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--card)" />
                <stop offset="100%" stopColor="var(--background)" />
              </linearGradient>

              <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--foreground)" />
                <stop offset="100%" stopColor="var(--muted-foreground)" />
              </linearGradient>

              <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#bbbbbb" />
                <stop offset="50%" stopColor="#888888" />
                <stop offset="100%" stopColor="#555555" />
              </linearGradient>
            </defs>

            <g id="traces">
              <path
                d="M100 100 H200 V210 H326"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1.8"
              />
              <path
                d="M100 100 H200 V210 H326"
                fill="none"
                stroke="#9900ff"
                strokeWidth="1.8"
                className="trace-flow"
                style={{
                  color: "#9900ff",
                  filter: "drop-shadow(0 0 6px currentColor)",
                }}
              />

              <path
                d="M80 180 H180 V230 H326"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1.8"
              />
              <path
                d="M80 180 H180 V230 H326"
                fill="none"
                stroke="#00ccff"
                strokeWidth="1.8"
                className="trace-flow"
                style={{
                  color: "#00ccff",
                  filter: "drop-shadow(0 0 6px currentColor)",
                }}
              />

              <path
                d="M60 260 H150 V250 H326"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1.8"
              />
              <path
                d="M60 260 H150 V250 H326"
                fill="none"
                stroke="#ffea00"
                strokeWidth="1.8"
                className="trace-flow"
                style={{
                  color: "#ffea00",
                  filter: "drop-shadow(0 0 6px currentColor)",
                }}
              />

              <path
                d="M100 350 H200 V270 H326"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1.8"
              />
              <path
                d="M100 350 H200 V270 H326"
                fill="none"
                stroke="#00ff15"
                strokeWidth="1.8"
                className="trace-flow"
                style={{
                  color: "#00ff15",
                  filter: "drop-shadow(0 0 6px currentColor)",
                }}
              />

              <path
                d="M700 90 H560 V210 H474"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1.8"
              />
              <path
                d="M700 90 H560 V210 H474"
                fill="none"
                stroke="#00ccff"
                strokeWidth="1.8"
                className="trace-flow"
                style={{
                  color: "#00ccff",
                  filter: "drop-shadow(0 0 6px currentColor)",
                }}
              />

              <path
                d="M740 160 H580 V230 H474"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1.8"
              />
              <path
                d="M740 160 H580 V230 H474"
                fill="none"
                stroke="#00ff15"
                strokeWidth="1.8"
                className="trace-flow"
                style={{
                  color: "#00ff15",
                  filter: "drop-shadow(0 0 6px currentColor)",
                }}
              />

              <path
                d="M720 250 H590 V250 H474"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1.8"
              />
              <path
                d="M720 250 H590 V250 H474"
                fill="none"
                stroke="#ff3300"
                strokeWidth="1.8"
                className="trace-flow"
                style={{
                  color: "#ff3300",
                  filter: "drop-shadow(0 0 6px currentColor)",
                }}
              />

              <path
                d="M680 340 H570 V270 H474"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1.8"
              />
              <path
                d="M680 340 H570 V270 H474"
                fill="none"
                stroke="#ffea00"
                strokeWidth="1.8"
                className="trace-flow"
                style={{
                  color: "#ffea00",
                  filter: "drop-shadow(0 0 6px currentColor)",
                }}
              />
            </g>

            <rect
              x="330"
              y="190"
              width="140"
              height="100"
              rx="20"
              ry="20"
              fill="url(#chipGradient)"
              stroke="var(--border)"
              strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,0.2))" }}
            />

            <g>
              {[205, 225, 245, 265].map((y) => (
                <rect
                  key={`pin-l-${y}`}
                  x="322"
                  y={y}
                  width="8"
                  height="10"
                  fill="url(#pinGradient)"
                  rx="2"
                  stroke="#444"
                  strokeWidth="0.5"
                  style={{ filter: "drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))" }}
                />
              ))}
            </g>

            <g>
              {[205, 225, 245, 265].map((y) => (
                <rect
                  key={`pin-r-${y}`}
                  x="470"
                  y={y}
                  width="8"
                  height="10"
                  fill="url(#pinGradient)"
                  rx="2"
                  stroke="#444"
                  strokeWidth="0.5"
                  style={{ filter: "drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))" }}
                />
              ))}
            </g>

            <text
              x="400"
              y="240"
              fontFamily="Poppins, sans-serif"
              fontSize="14"
              fontWeight="bold"
              fill="url(#textGradient)"
              textAnchor="middle"
              alignmentBaseline="middle"
              className="tracking-wider"
            >
              Sysm Pro
            </text>

            <circle cx="100" cy="100" r="5" fill="var(--foreground)" />
            <circle cx="80" cy="180" r="5" fill="var(--foreground)" />
            <circle cx="60" cy="260" r="5" fill="var(--foreground)" />
            <circle cx="100" cy="350" r="5" fill="var(--foreground)" />

            <circle cx="700" cy="90" r="5" fill="var(--foreground)" />
            <circle cx="740" cy="160" r="5" fill="var(--foreground)" />
            <circle cx="720" cy="250" r="5" fill="var(--foreground)" />
            <circle cx="680" cy="340" r="5" fill="var(--foreground)" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-8 -mt-10 z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Upgrade to Sysm Pro
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Unlock advanced neural processing, unlimited trace routes, and
              real-time system diagnostics.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-foreground tracking-tighter drop-shadow-lg">
                $29
              </span>
              <span className="text-2xl text-muted-foreground font-medium">/mo</span>
            </div>
            <p className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Save 20% with annual billing
            </p>
          </div>

          <Button className="h-14 px-10 text-lg rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl hover:scale-105 active:scale-95">
            Get Early Access
          </Button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center text-sm text-muted-foreground mt-4">
            {[
              "priority support",
              "unlimited access",
              "secure encryption",
              "cancel anytime",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-border" />
                <span className="uppercase tracking-widest text-[10px]">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProPage;