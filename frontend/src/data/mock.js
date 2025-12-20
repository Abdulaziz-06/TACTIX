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
      trigger: "Global Logistics Disruption",
      predictions: [
        "Retail price surge in 2 weeks",
        "Alternative route saturation",
        "Short-term inventory hoarding",
        "Shipping insurance rate hike"
      ]
    }
  },
  {
    id: 2,
    title: "Stock Market Impact",
    subtitle: "Stock Impact Analysis",
    slug: "market-intelligence",
    description: "Connect the dots between headlines and market movements. See how news ripples through sectors before it hits your portfolio.",
    icon: "TrendingUp",
    example: {
      trigger: "Fed Rate Hike Announcement",
      predictions: [
        "Banking sector +3.2%",
        "Tech growth stocks -4.1%",
        "Real estate REITs -2.8%",
        "Bond yields surge 0.5%"
      ]
    }
  },
  {
    id: 3,
    title: "Natural Events",
    subtitle: "Calamity Mapping",
    slug: "natural-events",
    description: "Hurricanes, earthquakes, wildfires—we map the cascade effect on supply chains, insurance, and infrastructure in real-time.",
    icon: "Zap",
    example: {
      trigger: "Category 4 Hurricane Florida",
      predictions: [
        "Citrus prices +40% spike",
        "Insurance claims $12B",
        "Port closures 72+ hours",
        "Tourism revenue -$890M"
      ]
    }
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
  { name: "How It Works", href: "#how-it-works" },
  { name: "Predictions", href: "#predictions" },
  { name: "Pricing", href: "#pricing" }
];
