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
      { title: "Dependent on only a single source for raw materials", content: "What national security risks arise from relying on a single source for defense raw materials during war?", tag: "Raw Materials" },
      { title: "Discovery of a new oil reserve in the country", content: "How can a major oil discovery lower exposure to global price shocks while raising risks of local displacement?", tag: "Natural Resources" },
      { title: "Ukraine unable to recieve raw materials for weapons manufacture from U.S", content: "Why is a Ukrainian weapons company unable to obtain raw materials from the US?", tag: "War Time" }
    ],

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
      { title: "Trade Tensions Between India and China", content: "How do trade tensions with China cause supply shocks in both pharma and electronics?", tag: "Market" },
      { title: "Single MNC takes over the new oil reserve found in the country", content: "What risks arise from regulatory capture if one firm controls a national oil reserve?", tag: "Natural Resources" },
      { title: "Increased military readiness at the border", content: "How does increased border military readiness create immediate risks for global trade and stock markets?", tag: "Military" }
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
      { title: "Earthquake in Delhi-NCR", content: "How do secondary hazards like gas fires and liquefaction worsen the humanitarian impact of a Delhi NCR earthquake?", tag: " Natural Phenomenon" },
      { title: "High import of goods for production of food", content: "What economic risks does India face if food shortages lead to heavy dependence on imports?", tag: "Famine" },
      { title: "Flood Risk", content: "How does damage to transport infrastructure hinder emergency rescue operations after a disaster?", tag: "Flood" }
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
  { value: "6.3s", label: "Avg. Prediction Time" },
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
