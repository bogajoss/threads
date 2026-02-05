import React, { useState } from "react";
import { PageTransition } from "@/components/layout";
import { Search, Gem, Hash, Gift, Star, Zap, Monitor, ArrowRight, Clock, Filter, Layers } from "lucide-react";
import { AUCTION_DATA, type AuctionItem, GIFT_COLLECTIONS, TOP_GIFTS } from "@/data/marketplace"; // Assuming you just created this
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const ShopPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Usernames");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Usernames", icon: Gem },
    { name: "Numbers", icon: Hash, disabled: true },
    { name: "Gifts", icon: Gift, new: true },
    { name: "Stars", icon: Star, disabled: true },
    { name: "Premium", icon: Zap },
    { name: "Ads", icon: Monitor },
  ];

  const filteredData = AUCTION_DATA.filter((item) =>
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
        {/* Navigation / Categories */}
        <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
            <div className="flex items-center space-x-1 md:space-x-2 py-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => !cat.disabled && setActiveTab(cat.name)}
                  disabled={cat.disabled}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    activeTab === cat.name
                      ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : cat.disabled
                        ? "opacity-50 cursor-not-allowed text-neutral-600"
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <cat.icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                  {cat.new && (
                    <span className="text-[10px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full ml-1">
                      NEW
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 mb-4 ring-1 ring-white/10">
              {activeTab === "Gifts" ? (
                <Gift className="w-8 h-8 text-amber-400" />
              ) : (
                <Gem className="w-8 h-8 text-blue-400" />
              )}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              {activeTab === "Gifts" ? "Collect Unique Gifts" : `Buy and Sell ${activeTab}`}
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              {activeTab === "Gifts"
                ? "Unique digital collectibles on the TON blockchain. Gift them to friends or trade them on the marketplace."
                : "Secure your name with blockchain in an ecosystem of 1+ billion users and assign it as a link for your personal account, channel or group."
              }
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mt-10 group">
              <div className={cn("absolute inset-0 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500",
                activeTab === "Gifts" ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
              )} />
              <div className="relative flex items-center bg-[#111] border border-white/10 rounded-full hover:border-white/20 transition-colors shadow-2xl">
                <Search className="w-5 h-5 text-neutral-500 ml-6" />
                <input
                  type="text"
                  placeholder={activeTab === "Gifts" ? "Search items and attributes..." : `Enter a ${activeTab.slice(0, -1)}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-white px-4 py-5 text-lg placeholder:text-neutral-600 focus:outline-none focus:ring-0 rounded-full"
                />
                <button className="mr-2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {activeTab === "Gifts" ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filter */}
              <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Layers className="w-4 h-4 text-neutral-400" />
                    Collections
                  </h3>
                  <span className="text-xs font-mono text-neutral-500 bg-white/5 px-2 py-1 rounded">107</span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search collections..."
                    className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-white/20 transition-colors"
                  />
                </div>

                <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 text-white font-medium text-sm">
                    <span>All Collections</span>
                    <span className="text-neutral-400 text-xs">887k</span>
                  </button>
                  {GIFT_COLLECTIONS.map((col) => (
                    <button key={col.name} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-neutral-300 hover:text-white transition-colors text-sm group">
                      <span>{col.name}</span>
                      <span className="text-neutral-600 group-hover:text-neutral-500 text-xs">{col.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gifts Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-500" />
                    Top Gifts
                  </h2>
                  <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                    Recently Sold
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {TOP_GIFTS.map((gift, i) => (
                    <div key={i} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden group hover:border-amber-500/30 transition-all hover:translate-y-[-2px] hover:shadow-xl cursor-pointer">
                      <div className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-6xl relative">
                        {gift.image}
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded text-white border border-white/10">
                          {gift.id}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-neutral-400 text-xs mb-1">{gift.date}</div>
                        <div className="font-bold text-white mb-2">{gift.name}</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 font-bold text-amber-400">
                            💎 {gift.price.toLocaleString()}
                          </div>
                          <div className="text-[10px] font-bold bg-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded uppercase tracking-wide">
                            {gift.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Auctions List (Usernames) */
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2 mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span className="w-2 h-8 bg-blue-500 rounded-full" />
                  Top Auctions
                </h2>
                <span className="text-neutral-500 text-sm">Live Updates</span>
              </div>

              <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs uppercase tracking-wider text-neutral-500 font-medium">
                  <div className="col-span-5 md:col-span-4">Username</div>
                  <div className="col-span-4 md:col-span-3">Top Bid</div>
                  <div className="col-span-3 md:col-span-3 hidden md:block">Auction Ends In</div>
                  <div className="col-span-3 md:col-span-2 text-right">Status</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                  {filteredData.map((item, index) => (
                    <AuctionRow key={index} item={item} />
                  ))}

                  {filteredData.length === 0 && (
                    <div className="py-20 text-center text-neutral-500">
                      No auctions found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

const AuctionRow: React.FC<{ item: AuctionItem }> = ({ item }) => {
  return (
    <Link to={`/shop/product/${item.username}`} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors group cursor-pointer block text-inherit no-underline">
      {/* Username Column */}
      <div className="col-span-5 md:col-span-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-colors">
          <Gem className="w-5 h-5 text-blue-400" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-lg truncate group-hover:text-blue-400 transition-colors">
              @{item.username}
            </span>
            {item.status === "Resale" && (
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-400 uppercase tracking-wide">
                Resale
              </span>
            )}
          </div>
          <div className="text-sm text-neutral-500 font-medium font-mono">
            {item.link}
          </div>
        </div>
      </div>

      {/* Bid Column */}
      <div className="col-span-4 md:col-span-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-white font-bold text-lg">
            <span className="text-blue-400">💎</span> {item.price.toLocaleString()}
          </div>
          <div className="text-sm text-neutral-500">
            ≈ ${item.priceUsd.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Time Column */}
      <div className="col-span-3 md:col-span-3 hidden md:flex flex-col justify-center">
        <div className="text-white font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-500" />
          {item.timeLeft}
        </div>
        <div className="text-sm text-neutral-500 pl-6">
          {item.dateTime}
        </div>
      </div>

      {/* Action/Status Column */}
      <div className="col-span-3 md:col-span-2 flex justify-end">
        <button className="px-4 py-2 rounded-full bg-white/5 hover:bg-white text-white hover:text-black font-medium text-sm transition-all text-center">
          Bid
        </button>
      </div>
    </Link>
  );
};

export default ShopPage;
