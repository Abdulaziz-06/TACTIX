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
      trigger: "State Electricity Tariff Restructuring",
      predictions: [
        "Data center operating costs +12-15%",
        "Cloud service pricing surge for end-users",
        "Tech infra expansion delays (Q3-Q4)",
        "Margin pressure on digital-first startups"
      ]
    },
    sampleNews: [
      { title: "Regulatory Note", content: "State regulator proposes revised peak-hour tariffs for heavy industry consumers.", tag: "POLICY" },
      { title: "Grid Authority", content: "Proposal released to reduce commercial subsidies for Tier-1 consumers.", tag: "UTILITY" },
      { title: "Consultation Paper", content: "Draft Consultation Paper 4B: Special energy pricing slabs for data parks.", tag: "DRAFT" }
    ],
    graphLabels: {
      root: "Tariff Hike",
      tl_mid: "Data Centers",
      tl_leaf_1: "OpEx Surge",
      tl_leaf_2: "Cloud Cost",
      tr_mid: "Tech Market",
      tr_leaf_1: "Stock Dip",
      tr_leaf_2: "Capex Pause",
      b_leaf_1: "Startups",
      b_leaf_2: "End Users"
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
      trigger: "Packaging Materials Sector Rotation",
      predictions: [
        "Paper/Pulp stocks +18%",
        "Oil & Gas chemical divisions -5%",
        "Waste Management volume dip",
        "Consumer goods margin squeeze"
      ]
    },
    sampleNews: [
      { title: "Market Rally", content: "International Paper hits 52-week high on ban news.", tag: "MARKETS" },
      { title: "Sector Downgrade", content: "Analysts downgrade petrochemical outlook to 'Sell' on lowered demand.", tag: "ANALYST" },
      { title: "Commodity Spike", content: "Pulp futures surge 30% overnight as manufacturers hoard supply.", tag: "COMMODITIES" }
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
      trigger: "Accelerated Deforestation Activity",
      predictions: [
        "Primary forest loss +12%",
        "Biodiversity corridor disruption",
        "Soil erosion risk in logging zones",
        "Water table stress"
      ]
    },
    sampleNews: [
      { title: "Satellite Alert", content: "Real-time imaging detects massive clearing in boreal zones.", tag: "ALERT" },
      { title: "Ecosystem Warning", content: "Biologists warn of critical habitat loss from sudden paper demand.", tag: "ENV" },
      { title: "Flood Risk", content: "Logging-induced soil instability raises regional flash flood risk.", tag: "CALAMITY" }
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
  },
  {
    id: 2,
    parent: "Policy Change",
    children: [
      { name: "Market Shift", children: ["Commodities", "Stocks", "Currency"] },
      { name: "Environmental Cost", children: ["Resources", "Habitats", "Climate"] },
      { name: "Social Response", children: ["Adoption", "Protest", "Lifestyle"] }
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
