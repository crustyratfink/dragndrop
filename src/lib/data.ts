export const dimensions:{[k:string]:any} = {
  strategy: {
    content: "Strategy",
    color: "rgba(255, 0, 0, 0.12)",
    options: ["lower funnel", "mid funnel", "upper funnel"],
  },
  publisher: {
    content: "Publisher",
    color: "rgba(0, 255, 0, 0.12)",
    options: ["trade desk", "google", "taboola"],
  },
  channel: {
    content: "Channel",
    color: "rgba(255, 255, 0, 0.12)",
    options: ["display", "video"],
  },
  tactic: {
    content: "Tactic",
    color: "rgba(0, 0, 255, 0.12)",
    options: ["retargeting", "prospecting"],
  },
};

export const sampleAllocations = [
  {
    id: 1,
    strategy: "lower funnel",
    publisher: "taboola",
    tactic: "retargeting",
    channel: "display",
    amount: 1000,
  },
  {
    id: 2,
    strategy: "mid funnel",
    publisher: "google",
    tactic: "prospecting",
    channel: "video",
    amount: 1000,
  },
  {
    id: 3,
    strategy: "upper funnel",
    publisher: "trade desk",
    tactic: "retargeting",
    channel: "display",
    amount: 1000,
  },
  {
    id: 4,
    strategy: "lower funnel",
    publisher: "google",
    tactic: "retargeting",
    channel: "video",
    amount: 1000,
  },
  {
    id: 5,
    strategy: "mid funnel",
    publisher: "trade desk",
    tactic: "prospecting",
    channel: "video",
    amount: 1000,
  },
  {
    id: 6,
    strategy: "upper funnel",
    publisher: "google",
    tactic: "retargeting",
    channel: "display",
    amount: 1000,
  },
  {
    id: 7,
    strategy: "upper funnel",
    publisher: "trade desk",
    tactic: "prospecting",
    channel: "display",
    amount: 1000,
  },
];