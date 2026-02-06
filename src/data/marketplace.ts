export interface AuctionItem {
  username: string;
  status?: string;
  link: string;
  price: number;
  currency: string;
  priceUsd: number;
  timeLeft: string;
  dateTime: string;
  bids?: number;
  bidStep?: string;
  minBid?: number;
  tonAddress?: string;
  bidHistory?: { price: number; date: string; from: string }[];
  ownershipHistory?: {
    price?: string;
    date: string;
    buyer: string;
    seller: string;
  }[];
}

export const AUCTION_DATA: AuctionItem[] = [
  {
    username: "danbao",
    status: "Resale",
    link: ".t.me",
    price: 70000,
    currency: "TON",
    priceUsd: 92606,
    timeLeft: "1 day 18 hours",
    dateTime: "7 Feb 2026 at 18:00",
    bidStep: "5%",
    minBid: 70000,
    tonAddress: "danbao.t.me",
    bidHistory: [
      { price: 66666, date: "5 Feb 2026 at 20:50", from: "fmvp.t.me" },
      {
        price: 50000,
        date: "5 Feb 2026 at 19:33",
        from: "UQBeCiay_6G2NBGmwCFUlxFt",
      },
    ],
    ownershipHistory: [
      {
        price: "Transferred",
        date: "31 Jan 2026 at 17:07",
        buyer: "UQBqSipgKmcXR-65TZoTwFzI",
        seller: "wIhQcaHNsFs8UM-wLz4FxWgt",
      },
      {
        price: "Transferred",
        date: "3 Dec 2023 at 20:19",
        buyer: "UQAcFxrg06YMs4OZ6HdYXjeP",
        seller: "3i8FQZB1bWlSb8ieGBaOr93z",
      },
      {
        price: "80,000",
        date: "2 Apr 2023 at 14:58",
        buyer: "UQCI5aT7gYqi3aEBZV23K3KQ",
        seller: "CJG219boGdL7jHHmucl3P_fC",
      },
    ],
  },
  {
    username: "investbanker",
    link: ".t.me",
    price: 31500,
    currency: "TON",
    priceUsd: 41673,
    timeLeft: "1 day 0 hours",
    dateTime: "6 Feb 2026 at 23:54",
  },
  {
    username: "stars",
    link: ".t.me",
    price: 29925,
    currency: "TON",
    priceUsd: 39589,
    timeLeft: "6 days 2 hours",
    dateTime: "12 Feb 2026 at 02:15",
  },
  {
    username: "kawaii",
    link: ".t.me",
    price: 11576,
    currency: "TON",
    priceUsd: 15314,
    timeLeft: "1 day 2 hours",
    dateTime: "7 Feb 2026 at 02:10",
  },
  {
    username: "misery",
    link: ".t.me",
    price: 11025,
    currency: "TON",
    priceUsd: 14585,
    timeLeft: "3 days 7 hours",
    dateTime: "9 Feb 2026 at 07:38",
  },
  {
    username: "faizeris",
    link: ".t.me",
    price: 10500,
    currency: "TON",
    priceUsd: 13891,
    timeLeft: "1 day 15 hours",
    dateTime: "7 Feb 2026 at 15:15",
  },
  {
    username: "svarnoy",
    link: ".t.me",
    price: 9345,
    currency: "TON",
    priceUsd: 12363,
    timeLeft: "1 day 3 hours",
    dateTime: "7 Feb 2026 at 02:44",
  },
  {
    username: "starbot",
    status: "Resale",
    link: ".t.me",
    price: 9333,
    currency: "TON",
    priceUsd: 12347,
    timeLeft: "4 days 1 hour",
    dateTime: "10 Feb 2026 at 01:00",
  },
  {
    username: "sokolov",
    link: ".t.me",
    price: 7692,
    currency: "TON",
    priceUsd: 10176,
    timeLeft: "4 days 18 hours",
    dateTime: "10 Feb 2026 at 18:14",
  },
  {
    username: "l234",
    link: ".t.me",
    price: 7129,
    currency: "TON",
    priceUsd: 9431,
    timeLeft: "16 hours 12 minutes",
    dateTime: "6 Feb 2026 at 15:55",
  },
  {
    username: "okyl",
    link: ".t.me",
    price: 6571,
    currency: "TON",
    priceUsd: 8693,
    timeLeft: "3 days 19 hours",
    dateTime: "9 Feb 2026 at 19:03",
  },
  {
    username: "jgyl",
    link: ".t.me",
    price: 6497,
    currency: "TON",
    priceUsd: 8595,
    timeLeft: "1 day 21 hours",
    dateTime: "7 Feb 2026 at 21:37",
  },
  {
    username: "aidb",
    link: ".t.me",
    price: 6472,
    currency: "TON",
    priceUsd: 8562,
    timeLeft: "2 days 1 hour",
    dateTime: "8 Feb 2026 at 01:36",
  },
  {
    username: "cuba",
    link: ".t.me",
    price: 6468,
    currency: "TON",
    priceUsd: 8557,
    timeLeft: "2 days 1 hour",
    dateTime: "8 Feb 2026 at 00:59",
  },
  {
    username: "dino",
    link: ".t.me",
    price: 6095,
    currency: "TON",
    priceUsd: 8063,
    timeLeft: "1 day 5 hours",
    dateTime: "7 Feb 2026 at 05:23",
  },
  {
    username: "jpeg",
    link: ".t.me",
    price: 6093,
    currency: "TON",
    priceUsd: 8061,
    timeLeft: "1 day 5 hours",
    dateTime: "7 Feb 2026 at 05:24",
  },
  {
    username: "trial",
    status: "Resale",
    link: ".t.me",
    price: 5325,
    currency: "TON",
    priceUsd: 7045,
    timeLeft: "94 days 16 hours",
    dateTime: "11 May 2026 at 15:51",
  },
];

export const GIFT_COLLECTIONS = [
  { name: "Plush Pepes", count: "2,330" },
  { name: "Snoop Doggs", count: "35,788" },
  { name: "Artisan Bricks", count: "1,968" },
  { name: "Astral Shards", count: "2,455" },
  { name: "B-Day Candles", count: "19,650" },
  { name: "Berry Boxes", count: "7,620" },
  { name: "Big Years", count: "8,073" },
  { name: "Magic Potions", count: "3,067" },
  { name: "Lol Pops", count: "54,536" },
  { name: "Spy Agarics", count: "26,663" },
  { name: "Homemade Cakes", count: "29,780" },
  { name: "Toy Bears", count: "27,221" },
  { name: "Witch Hats", count: "28,955" },
];

export const TOP_GIFTS = [
  {
    name: "Plush Pepe",
    id: "#1821",
    date: "Feb 5 at 20:41",
    price: 88888,
    status: "Sold",
    image: "🐸",
  },
  {
    name: "Plush Pepe",
    id: "#1515",
    date: "Aug 18, 2025 at 07:39",
    price: 48000,
    status: "Sold",
    image: "🐸",
  },
  {
    name: "Plush Pepe",
    id: "#2658",
    date: "Jul 25, 2025 at 00:43",
    price: 30000,
    status: "Sold",
    image: "🐸",
  },
  {
    name: "Plush Pepe",
    id: "#1521",
    date: "Jan 21 at 02:54",
    price: 28555,
    status: "Sold",
    image: "🐸",
  },
  {
    name: "Plush Pepe",
    id: "#318",
    date: "Jan 23 at 00:28",
    price: 23519,
    status: "Sold",
    image: "🐸",
  },
  {
    name: "Plush Pepe",
    id: "#1179",
    date: "Jan 10 at 09:10",
    price: 20888,
    status: "Sold",
    image: "🐸",
  },
  {
    name: "Plush Pepe",
    id: "#456",
    date: "Jan 14 at 23:56",
    price: 19999,
    status: "Sold",
    image: "🐸",
  },
  {
    name: "Plush Pepe",
    id: "#858",
    date: "Aug 2, 2025 at 04:34",
    price: 15000,
    status: "Sold",
    image: "🐸",
  },
  {
    name: "Swiss Watch",
    id: "#7799",
    date: "Jan 10 at 10:52",
    price: 13588,
    status: "Sold",
    image: "⌚",
  },
  {
    name: "Plush Pepe",
    id: "#899",
    date: "Jan 28 at 11:57",
    price: 13500,
    status: "Sold",
    image: "🐸",
  },
  {
    name: "Heart Locket",
    id: "#875",
    date: "Sep 7, 2025 at 01:05",
    price: 12733.88,
    status: "Sold",
    image: "💝",
  },
  {
    name: "Plush Pepe",
    id: "#91",
    date: "Jan 28 at 11:10",
    price: 12500,
    status: "Sold",
    image: "🐸",
  },
  {
    name: "Plush Pepe",
    id: "#206",
    date: "Jan 30 at 13:14",
    price: 12388,
    status: "Sold",
    image: "🐸",
  },
];
