// Mock data for Tactix landing page

export const features = [
  {
    id: 1,
    title: "Generic",
    subtitle: "Real-time Forecasting",
    slug: "event-predictor",
    description: "Our core AI engine processes thousands of data streams to predict causal ripples. Ask the agent about any current event to see its predicted future impacts.",
    icon: "Zap",
    example: {
      trigger: "Global Lithium Supply Crunch",
      predictions: [
        "EV production targets missed by 15%",
        "Battery replacement costs +25%",
        "Legacy auto delaying EV rollout",
        "Recycling startup funding boom"
      ]
    },
    sampleNews: [
      { title: "Lithium Export Ban", content: "Major producer announces immediate ban on raw lithium exports.", tag: "POLICY" },
      { title: "Gigafactory Paused", content: "Construction on Nevada battery plant halted due to supply uncertainty.", tag: "BUSINESS" },
      { title: "Solid State Hype", content: "New research suggests sodium-ion alternatives could bypass lithium need.", tag: "TECH" }
    ]
  },
  {
    id: 2,
    title: "Stock Market Impact",
    subtitle: "Stock Impact Analysis",
    slug: "market-intelligence",
    description: "Connect the dots between headlines and market movements. See how news ripples through sectors before it hits your portfolio.",
    icon: "TrendingUp",
    example: {
      trigger: "EV Sector Market Correction",
      predictions: [
        "Pure-play EV stocks -12%",
        "Lithium miners (ALB, LAC) +8.5%",
        "Diversified auto (Toyota, Ford) stable",
        "Battery tech ETF volume spike"
      ]
    },
    sampleNews: [
      { title: "Miner Earnings Beat", content: "Lithium mining giant reports record Q3 profits on price surge.", tag: "EARNINGS" },
      { title: "Auto Index Drop", content: "Global Auto Index falls 4% as EV production targets are slashed.", tag: "MARKETS" },
      { title: "Green Energy ETF", content: "Heavy outflows from renewables ETFs as supply chain fears mount.", tag: "FUNDS" }
    ]
  },
  {
    id: 3,
    title: "Natural Events",
    subtitle: "Calamity Mapping",
    slug: "natural-events",
    description: "Hurricanes, earthquakes, wildfires—we map the cascade effect on supply chains, insurance, and infrastructure in real-time.",
    icon: "Zap",
    example: {
      trigger: "Flash Floods in Key Mining Region",
      predictions: [
        "Extraction operations halted 21 days",
        "Regional rail infrastructure damaged",
        "Force majeure declared by suppliers",
        "Local ecosystem remediation costs"
      ]
    },
    sampleNews: [
      { title: "Dam Breach Warning", content: "Structural integrity warning issued for tailings dam in heavy rain zone.", tag: "ALERT" },
      { title: "Rail Line Washout", content: "Main mineral transport corridor severed by flash flooding.", tag: "LOGISTICS" },
      { title: "Insurance Moratorium", content: "Insurers pause new underwriting for mining projects in flood zones.", tag: "FINANCE" }
    ]
  }
];

export const nodeConnections = [
  {
    id: 1,
    parent: "Breaking News",
    children: [
      { name: "Direct Impact", children: ["Companies", "Services", "Markets"] },
      { name: "Secondary Effects", children: ["Supply Chain", "Employment", "Consumer"] },
      { name: "Tertiary Ripples", children: ["Policy", "Sentiment", "Long-term"] }
    ]
  }
];

export const stats = [
  { value: "2.4s", label: "Avg. Prediction Time" },
  { value: "94%", label: "Accuracy Rate" },
  { value: "10K+", label: "Factors Analyzed" },
  { value: "0", label: "Ads. Ever." }
];

export const comparisons = [
  { traditional: "News 6 hours late", tactix: "Predictions before it happens" },
  { traditional: "Cluttered with ads", tactix: "Zero advertisements" },
  { traditional: "Surface-level reporting", tactix: "Deep causal analysis" },
  { traditional: "Single story focus", tactix: "Connected impact mapping" }
];

export const testimonials = [
  {
    quote: "Tactix predicted the silicon shortage impact on my portfolio 3 weeks before traditional news caught on.",
    author: "Marcus Chen",
    role: "Hedge Fund Manager"
  },
  {
    quote: "The calamity mapping saved our logistics planning during hurricane season. We rerouted before competitors even knew.",
    author: "Sarah Williams",
    role: "Supply Chain Director"
  }
];

export const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" }
  // { name: "Predictions", href: "#predictions" },
  // { name: "Pricing", href: "#pricing" }
];
