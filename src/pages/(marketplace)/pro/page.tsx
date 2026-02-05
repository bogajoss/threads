import React from "react";
import { PageTransition } from "@/components/layout";

const ProPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="flex h-[80vh] w-full items-center justify-center">
        <style dangerouslySetInnerHTML={{ __html: `
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
        ` }} />
        <div className="w-full max-w-2xl">
          <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <defs>
              <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2d2d2d" />
                <stop offset="100%" stopColor="#0f0f0f" />
              </linearGradient>

              <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eeeeee" />
                <stop offset="100%" stopColor="#888888" />
              </linearGradient>

              <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#bbbbbb" />
                <stop offset="50%" stopColor="#888888" />
                <stop offset="100%" stopColor="#555555" />
              </linearGradient>
            </defs>

            <g id="traces">
              {/* Left Traces */}
              <path d="M100 100 H200 V210 H326" fill="none" stroke="#333" strokeWidth="1.8" />
              <path d="M100 100 H200 V210 H326" fill="none" stroke="#9900ff" strokeWidth="1.8" className="trace-flow" style={{ color: '#9900ff', filter: 'drop-shadow(0 0 6px currentColor)' }} />

              <path d="M80 180 H180 V230 H326" fill="none" stroke="#333" strokeWidth="1.8" />
              <path d="M80 180 H180 V230 H326" fill="none" stroke="#00ccff" strokeWidth="1.8" className="trace-flow" style={{ color: '#00ccff', filter: 'drop-shadow(0 0 6px currentColor)' }} />

              <path d="M60 260 H150 V250 H326" fill="none" stroke="#333" strokeWidth="1.8" />
              <path d="M60 260 H150 V250 H326" fill="none" stroke="#ffea00" strokeWidth="1.8" className="trace-flow" style={{ color: '#ffea00', filter: 'drop-shadow(0 0 6px currentColor)' }} />

              <path d="M100 350 H200 V270 H326" fill="none" stroke="#333" strokeWidth="1.8" />
              <path d="M100 350 H200 V270 H326" fill="none" stroke="#00ff15" strokeWidth="1.8" className="trace-flow" style={{ color: '#00ff15', filter: 'drop-shadow(0 0 6px currentColor)' }} />

              {/* Right Traces */}
              <path d="M700 90 H560 V210 H474" fill="none" stroke="#333" strokeWidth="1.8" />
              <path d="M700 90 H560 V210 H474" fill="none" stroke="#00ccff" strokeWidth="1.8" className="trace-flow" style={{ color: '#00ccff', filter: 'drop-shadow(0 0 6px currentColor)' }} />

              <path d="M740 160 H580 V230 H474" fill="none" stroke="#333" strokeWidth="1.8" />
              <path d="M740 160 H580 V230 H474" fill="none" stroke="#00ff15" strokeWidth="1.8" className="trace-flow" style={{ color: '#00ff15', filter: 'drop-shadow(0 0 6px currentColor)' }} />

              <path d="M720 250 H590 V250 H474" fill="none" stroke="#333" strokeWidth="1.8" />
              <path d="M720 250 H590 V250 H474" fill="none" stroke="#ff3300" strokeWidth="1.8" className="trace-flow" style={{ color: '#ff3300', filter: 'drop-shadow(0 0 6px currentColor)' }} />

              <path d="M680 340 H570 V270 H474" fill="none" stroke="#333" strokeWidth="1.8" />
              <path d="M680 340 H570 V270 H474" fill="none" stroke="#ffea00" strokeWidth="1.8" className="trace-flow" style={{ color: '#ffea00', filter: 'drop-shadow(0 0 6px currentColor)' }} />
            </g>

            <rect
              x="330"
              y="190"
              width="140"
              height="100"
              rx="20"
              ry="20"
              fill="url(#chipGradient)"
              stroke="#222"
              strokeWidth="3"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.8))' }}
            />

            <g>
              {[205, 225, 245, 265].map((y) => (
                <rect key={`pin-l-${y}`} x="322" y={y} width="8" height="10" fill="url(#pinGradient)" rx="2" stroke="#444" strokeWidth="0.5" style={{ filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))' }} />
              ))}
            </g>

            <g>
              {[205, 225, 245, 265].map((y) => (
                <rect key={`pin-r-${y}`} x="470" y={y} width="8" height="10" fill="url(#pinGradient)" rx="2" stroke="#444" strokeWidth="0.5" style={{ filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))' }} />
              ))}
            </g>

            <text
              x="400"
              y="240"
              fontFamily="Arial, sans-serif"
              fontSize="14"
              fontWeight="bold"
              fill="url(#textGradient)"
              textAnchor="middle"
              alignmentBaseline="middle"
              className="tracking-wider"
            >
              Sysm Pro
            </text>

            {/* Terminal Points */}
            <circle cx="100" cy="100" r="5" fill="black" />
            <circle cx="80" cy="180" r="5" fill="black" />
            <circle cx="60" cy="260" r="5" fill="black" />
            <circle cx="100" cy="350" r="5" fill="black" />

            <circle cx="700" cy="90" r="5" fill="black" />
            <circle cx="740" cy="160" r="5" fill="black" />
            <circle cx="720" cy="250" r="5" fill="black" />
            <circle cx="680" cy="340" r="5" fill="black" />
          </svg>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProPage;