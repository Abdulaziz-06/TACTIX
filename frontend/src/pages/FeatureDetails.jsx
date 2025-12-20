import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Server, TrendingUp, Zap, ChevronRight, Share2, Download, Send, Bot, User, Sparkles } from 'lucide-react';
import { features } from '../data/mock';
import Header from '../components/landing/Header';

const iconMap = {
    Server: Server,
    TrendingUp: TrendingUp,
    Zap: Zap
};

const FeatureDetails = () => {
    const { slug } = useParams();
    const feature = features.find(f => f.slug === slug);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI event prediction agent. Tell me about a current event, and I will analyze the causal ripples for you.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    if (!feature) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <h1 className="text-4xl font-bold mb-4">Analysis Not Found</h1>
                <Link to="/" className="text-[#00FFD1] flex items-center gap-2 hover:underline">
                    <ArrowLeft size={20} /> View All Pillars
                </Link>
            </div>
        );
    }

    const sampleNews = [
        {
            title: "Chip Shortage",
            content: "Global chip shortage worsens as key manufacturing hubs face power outages.",
            tag: "TECH"
        },
        {
            title: "Oil Volatility",
            content: "Oil prices drop by 15% following surprise production increase announcement.",
            tag: "MARKETS"
        },
        {
            title: "Battery Breakthrough",
            content: "New breakthrough in solid-state batteries promises 1000km range for EVs.",
            tag: "ENERGY"
        }
    ];

    const sendMessage = (text) => {
        if (!text.trim()) return;

        const userMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "Based on current data streams, this event will likely trigger a 15% increase in logistics costs within 48 hours.",
                "I've mapped this to secondary impacts in the energy sector. Expect crude volatility reaching +3.4% by EOD.",
                "Analysis complete. This aligns with the 'Cascade Effect 4' pattern seen in Q2. Confidence score: 92.8%.",
                "Connecting the dots... This event has a 70% probability of affecting regional supply chains for at least 12 days."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        sendMessage(input);
        setInput('');
    };

    const IconComponent = iconMap[feature.icon];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00FFD1] selection:text-black">
            <Header />

            <main className="pt-32 pb-24">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-[7.6923%]">
                    {/* Back button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/50 hover:text-[#00FFD1] transition-colors mb-8 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>

                    <div className="max-w-6xl mx-auto flex flex-col gap-12">
                        {/* Sample News Cards - Increased Size */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {sampleNews.map((news, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => sendMessage(news.content)}
                                    className="text-left bg-[#121212] border border-white/10 p-8 hover:border-[#00FFD1]/50 hover:bg-[#00FFD1]/5 transition-all group flex flex-col h-full min-h-[220px]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[#00FFD1] text-xs font-bold tracking-widest uppercase">{news.tag}</span>
                                        <Sparkles size={18} className="text-[#00FFD1] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h4 className="text-white text-xl font-bold mb-3 group-hover:text-[#00FFD1] transition-colors">{news.title}</h4>
                                    <p className="text-white/50 text-base leading-relaxed">
                                        {news.content}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {/* Chatbot Section - Lowered with mt-24 */}
                        <div className="mt-24 bg-[#0A0A0A] border border-white/10 flex flex-col h-[700px] relative overflow-hidden shadow-2xl shadow-[#00FFD1]/5">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#00FFD1]/10 rounded-full flex items-center justify-center border border-[#00FFD1]/20">
                                        <Bot size={20} className="text-[#00FFD1]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Causal Impact Agent</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-[#00FFD1] rounded-full animate-pulse" />
                                            <span className="text-white/40 text-[10px] uppercase tracking-tighter">Live Reasoning Engaged</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-white/40 hover:text-white transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                    <button className="p-2 text-white/40 hover:text-white transition-colors">
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                            >
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white/10 border border-white/20' : 'bg-[#00FFD1]/10 border border-[#00FFD1]/20'
                                            }`}>
                                            {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-[#00FFD1]" />}
                                        </div>
                                        <div className={`max-w-[80%] p-4 rounded-lg relative ${msg.role === 'user'
                                            ? 'bg-white/5 text-white border border-white/10 rounded-tr-none'
                                            : 'bg-[#00FFD1]/5 text-white border border-[#00FFD1]/10 rounded-tl-none'
                                            }`}>
                                            <p className="text-base leading-relaxed">{msg.content}</p>
                                            <span className="text-[10px] text-white/20 mt-2 block uppercase text-right">
                                                {msg.role === 'user' ? 'Sent' : 'Agent Response'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#00FFD1]/10 border border-[#00FFD1]/20 flex items-center justify-center">
                                            <Bot size={18} className="text-[#00FFD1]" />
                                        </div>
                                        <div className="bg-[#00FFD1]/5 p-4 rounded-lg border border-[#00FFD1]/10 rounded-tl-none flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-[#00FFD1]/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 bg-[#00FFD1]/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 bg-[#00FFD1]/50 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <form
                                onSubmit={handleSendMessage}
                                className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-sm"
                            >
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask about an event... (e.g. 'What happens if oil prices drop by 20%?')"
                                        className="w-full bg-white/5 border border-white/10 p-5 pr-16 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FFD1]/50 transition-all rounded-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isTyping}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-[#00FFD1] text-black hover:bg-[#00FFD1]/80 disabled:bg-white/10 disabled:text-white/20 transition-all rounded-sm"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                                <p className="mt-3 text-[10px] text-white/20 flex items-center gap-2">
                                    <Sparkles size={10} className="text-[#00FFD1]" />
                                    AI AGENT IS ACTIVELY PROCESSING GLOBAL NEWS STREAM
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FeatureDetails;
