import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { PageTransition } from "@/components/layout";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Search,
  Bell,
  Info,
  ExternalLink,
  Copy,
  Gem,
  History,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { AUCTION_DATA } from "@/data/marketplace";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const product = useMemo(() => {
    return AUCTION_DATA.find((p) => p.username === id) || AUCTION_DATA[0];
  }, [id]);

  if (!product) return <div>Product not found</div>;

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 pb-20">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
            <Link
              to="/shop"
              className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1 relative max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search usernames..."
                className="w-full bg-[#111] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm focus:border-blue-500/50 transition-colors"
              />
            </div>
            <div className="flex-1 md:hidden text-center font-bold text-lg">
              @{product.username}
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {product.username}
                </h1>
                <span className="text-2xl md:text-3xl text-neutral-500 font-light">
                  {product.link}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="text-green-400 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  On auction
                </span>
                <button className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
                  <Bell className="w-4 h-4" />
                  Subscribe to updates
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" /> Open
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bid Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Gem className="w-12 h-12 text-blue-500" />
                  </div>
                  <div className="text-neutral-500 text-xs uppercase tracking-wider font-semibold mb-1">
                    Highest Bid
                  </div>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    <span className="text-blue-400">💎</span>{" "}
                    {product.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-500 mt-1">
                    ~ ${product.priceUsd.toLocaleString()}
                  </div>
                </div>

                <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
                  <div className="text-neutral-500 text-xs uppercase tracking-wider font-semibold mb-1">
                    Bid Step
                  </div>
                  <div className="text-2xl font-bold">
                    {product.bidStep || "5%"}
                  </div>
                  <div className="text-sm text-neutral-500 mt-1">
                    Minimum increment
                  </div>
                </div>

                <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
                  <div className="text-neutral-500 text-xs uppercase tracking-wider font-semibold mb-1">
                    Minimum Bid
                  </div>
                  <div className="text-2xl font-bold">
                    <span className="text-blue-400">💎</span>{" "}
                    {(product.minBid || product.price * 1.05).toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-500 mt-1">
                    ~ $
                    {(
                      (product.priceUsd / product.price) *
                      (product.minBid || product.price * 1.05)
                    )
                      .toFixed(0)
                      .toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Links Section */}
              <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Detailed Info</h3>
                  <Info className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="divide-y divide-white/5">
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span className="text-neutral-400">Telegram Username</span>
                    <a
                      href={`https://t.me/${product.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline font-medium"
                    >
                      @{product.username}
                    </a>
                  </div>
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span className="text-neutral-400">Web Address</span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 hover:underline font-medium cursor-pointer">
                        t.me/{product.username}
                      </span>
                      <Copy className="w-4 h-4 text-neutral-600 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span className="text-neutral-400">
                      TON Web 3.0 Address
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 hover:underline font-medium cursor-pointer">
                        {product.username}.t.me
                      </span>
                      <Copy className="w-4 h-4 text-neutral-600 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bid History */}
              {product.bidHistory && (
                <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Bid History</h3>
                    <History className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-neutral-500 font-medium border-b border-white/5 bg-white/[0.02]">
                        <tr>
                          <th className="px-6 py-3">Price</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3 text-right">From</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {product.bidHistory.map((bid, i) => (
                          <tr key={i} className="hover:bg-white/[0.02]">
                            <td className="px-6 py-4 font-bold">
                              <span className="text-blue-400">💎</span>{" "}
                              {bid.price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-neutral-400">
                              {bid.date}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-mono text-blue-400 hover:underline cursor-pointer truncate max-w-[150px] inline-block align-bottom">
                                {bid.from}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Ownership History */}
              {product.ownershipHistory && (
                <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Ownership History</h3>
                    <ShieldCheck className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-neutral-500 font-medium border-b border-white/5 bg-white/[0.02]">
                        <tr>
                          <th className="px-6 py-3">Sale Price</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3 text-right">Buyer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {product.ownershipHistory.map((record, i) => (
                          <tr key={i} className="hover:bg-white/[0.02]">
                            <td className="px-6 py-4 font-bold">
                              {record.price === "Transferred" ? (
                                <span className="text-neutral-500 font-medium">
                                  {record.price}
                                </span>
                              ) : (
                                <span>
                                  <span className="text-blue-400">💎</span>{" "}
                                  {record.price}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-neutral-400">
                              {record.date}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-mono text-blue-400 hover:underline cursor-pointer truncate max-w-[150px] inline-block align-bottom">
                                {record.buyer}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  How does this work?
                </h3>
                <p className="text-neutral-300 leading-relaxed max-w-2xl">
                  You can buy this collectible username and use it for your
                  personal profile, group or channel. Usernames are stored on
                  the TON blockchain as NFTs.
                </p>
                <div className="mt-4 flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/20 border-white/10 hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="space-y-6">
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sticky top-24">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white rounded-xl">
                    <QRCodeSVG
                      value={`https://t.me/${product.username}`}
                      size={160}
                    />
                  </div>
                </div>

                <h3 className="text-center text-xl font-bold mb-1">
                  Scan to bid
                </h3>
                <p className="text-center text-neutral-500 text-sm mb-6">
                  Open Tonkeeper to place a bid
                </p>

                <div className="bg-neutral-900 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-neutral-400 text-sm">Ends in</span>
                    <span className="font-mono font-medium">
                      {product.timeLeft}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[70%]" />
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 text-lg mb-3">
                  Place a Bid
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/5 text-neutral-300"
                >
                  Make an offer
                </Button>
              </div>

              <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold mb-4">Bot Usernames</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                  This username has been upgraded and it can now be assigned not
                  just to channels, groups or users, but also to bots.
                </p>
                <Link
                  to="#"
                  className="text-blue-400 text-sm hover:underline flex items-center gap-1"
                >
                  Read more <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default ProductPage;
