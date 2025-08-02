import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Loader2, ExternalLink, Info } from "lucide-react";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
    contextUsed?: boolean;
    flowType?: string;
    timestamp?: string;
}

interface Source {
    url: string;
    title: string;
    snippet: string;
    relevance_score: number;
}

interface ChatResponse {
    response: string;
    context_used: boolean;
    context_count: number;
    sources: Source[];
    flow_type: string;
    system_metadata: {
        timestamp: string;
        version: string;
        context_type?: string;
    };
}

const ChatbotWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [systemStatus, setSystemStatus] = useState<'healthy' | 'degraded' | 'unknown'>('unknown');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // API Configuration
    const API_BASE_URL = "https://eu5hqnjt2i.execute-api.ap-south-1.amazonaws.com/development";
    const API_KEY = "nouscloud-api-key-2024";

    // Scroll to bottom on n
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    // Check system health when component mounts
    useEffect(() => {
        checkSystemHealth();
    }, []);

    // Clear messages when chat is opened
    useEffect(() => {
        if (open) {
            setMessages([]);
            localStorage.removeItem("chatbot-messages");
        }
    }, [open]);

    const checkSystemHealth = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/health`);
            const data = await res.json();
            setSystemStatus(data.status === 'healthy' ? 'healthy' : 'degraded');
        } catch (error) {
            console.error("Health check failed:", error);
            setSystemStatus('degraded');
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { role: "user" as const, content: input };
        const userInput = input.trim(); // Store the input before clearing
        setMessages((msgs: ChatMessage[]) => [...msgs, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Updated API endpoint for the enhanced chatbot
            const res = await fetch(`${API_BASE_URL}/api/chatbot/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({
                    message: userInput,
                    include_sources: true
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data: ChatResponse = await res.json();

            const assistantMsg: ChatMessage = {
                role: "assistant",
                content: data.response,
                sources: data.sources || [],
                contextUsed: data.context_used,
                flowType: data.flow_type,
                timestamp: data.system_metadata.timestamp
            };

            setMessages((msgs: ChatMessage[]) => [...msgs, assistantMsg]);
        } catch (e) {
            console.error("Chat error:", e);
            setMessages((msgs: ChatMessage[]) => [...msgs, {
                role: "assistant",
                content: "Sorry, I'm experiencing some technical difficulties. Please try again later or contact our support team for assistance."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !loading && input.trim()) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (loading) return;
        setInput(suggestion);
        // Small delay to ensure input is set before sending
        setTimeout(() => {
            sendMessage();
        }, 50);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                className="fixed bottom-6 left-6 z-50 bg-primary text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary relative"
                onClick={() => setOpen(true)}
                aria-label="Open NousCloud AI Assistant"
                style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.15)" }}
            >
                <MessageCircle size={28} />

                {/* System status indicator */}
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${systemStatus === 'healthy' ? 'bg-green-500' :
                        systemStatus === 'degraded' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} title={`System status: ${systemStatus}`} />
            </button>

            {/* Chat Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-start md:justify-center bg-black/30 backdrop-blur-sm">
                    <div className="w-full max-w-md md:rounded-lg bg-white shadow-2xl flex flex-col h-[70vh] md:h-[80vh] animate-fade-in-up relative md:mb-0 mb-4 md:ml-0 ml-4">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-blue-600 text-white">
                            <div className="flex items-center gap-2">
                                <MessageCircle size={20} />
                                <div>
                                    <div className="font-bold text-lg">NousCloud AI Assistant</div>
                                    <div className="text-xs opacity-90">Enhanced with contextual knowledge</div>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                                <X size={22} />
                            </button>
                        </div>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-gray-50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 mt-4">
                                    <div className="mb-3">👋 Hi! I'm the NousCloud AI Assistant</div>
                                    <div className="text-xs mb-4">Ask me about our services, courses, webinars, or anything else!</div>

                                    {/* Quick action buttons */}
                                    <div className="space-y-2">
                                        <div className="text-xs font-medium text-gray-500 mb-2">Try asking:</div>
                                        <div className="space-y-1">
                                            {[
                                                "What services does NousCloud offer?",
                                                "Tell me about your AI capabilities",
                                                "Do you have any upcoming webinars?",
                                                "How can I contact NousCloud?"
                                            ].map((suggestion, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className="block w-full text-left px-3 py-2 text-xs bg-white border rounded-lg hover:bg-gray-50 hover:border-primary transition-colors disabled:opacity-50"
                                                    disabled={loading}
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {messages.map((msg: ChatMessage, i: number) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`rounded-lg px-4 py-2 max-w-[85%] text-sm shadow ${msg.role === "user" ? "bg-primary text-white" : "bg-white text-gray-800 border"}`}>
                                        <div className="whitespace-pre-wrap">{msg.content}</div>

                                        {/* Enhanced features for assistant messages */}
                                        {msg.role === "assistant" && (
                                            <div className="mt-3 space-y-2">
                                                {/* Context indicator */}
                                                {msg.contextUsed && (
                                                    <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        <Info size={12} />
                                                        <span>Enhanced with company knowledge</span>
                                                    </div>
                                                )}

                                                {/* Sources */}
                                                {msg.sources && msg.sources.length > 0 && (
                                                    <div className="border-t pt-2">
                                                        <div className="text-xs font-medium text-gray-600 mb-1">Sources:</div>
                                                        <div className="space-y-1">
                                                            {msg.sources.map((source: Source, idx: number) => (
                                                                <div key={idx} className="text-xs bg-gray-50 p-2 rounded border-l-2 border-blue-200">
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="flex-1">
                                                                            <div className="font-medium text-gray-700">{source.title}</div>
                                                                            <div className="text-gray-500 mt-1">{source.snippet}</div>
                                                                        </div>
                                                                        {source.url && (
                                                                            <a
                                                                                href={source.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-500 hover:text-blue-700 flex-shrink-0"
                                                                                title="Open source"
                                                                            >
                                                                                <ExternalLink size={12} />
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                    <div className="mt-1 text-xs text-gray-400">
                                                                        Relevance: {Math.round((source.relevance_score || 0) * 100)}%
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Flow type indicator */}
                                                {msg.flowType && (
                                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                                        <span>Response type: {msg.flowType.replace(/_/g, ' ')}</span>
                                                        {msg.timestamp && (
                                                            <span className="ml-2">• {new Date(msg.timestamp).toLocaleTimeString()}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Loading indicator */}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white text-gray-800 border rounded-lg px-4 py-2 max-w-[85%] text-sm shadow">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="animate-spin" size={16} />
                                            <span>Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                        {/* Input */}
                        <div className="p-4 border-t flex gap-2 bg-white">
                            <input
                                type="text"
                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ask about our services, courses, webinars..."
                                value={input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                disabled={loading}
                                autoFocus
                            />
                            <button
                                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60 hover:bg-primary/90 transition-colors"
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : "Send"}
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="px-4 pb-2 text-xs text-gray-400 text-center">
                            Powered by NousCloud AI • Enhanced with contextual knowledge
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;
