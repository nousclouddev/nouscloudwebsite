import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Loader2 } from "lucide-react";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

const ChatbotWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState < ChatMessage[] > ([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef < HTMLDivElement > (null);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    // Clear messages when chat is opened
    useEffect(() => {
        if (open) {
            setMessages([]);
            localStorage.removeItem("chatbot-messages");
        }
    }, [open]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { role: "user" as const, content: input };
        const userInput = input.trim(); // Store the input before clearing
        setMessages((msgs) => [...msgs, userMsg]);
        setInput("");
        setLoading(true);
        try {
            // POST to: https://5ppqql37ni.execute-api.ap-south-1.amazonaws.com/Prod/api/chatbot/send
            // Headers: { "Content-Type": "application/json", "x-api-key": "changeme" }
            // Body: { "message": "Your message here" }
            const res = await fetch("https://5ppqql37ni.execute-api.ap-south-1.amazonaws.com/Prod/api/chatbot/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "changeme"
                },
                body: JSON.stringify({ message: userInput }),
            });
            const data = await res.json();
            setMessages((msgs) => [...msgs, { role: "assistant", content: data.response }]);
        } catch (e) {
            setMessages((msgs) => [...msgs, { role: "assistant", content: "Sorry, something went wrong." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !loading) sendMessage();
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                className="fixed bottom-6 left-6 z-50 bg-primary text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setOpen(true)}
                aria-label="Open chatbot"
                style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.15)" }}
            >
                <MessageCircle size={28} />
            </button>

            {/* Chat Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-start md:justify-center bg-black/30 backdrop-blur-sm">
                    <div className="w-full max-w-md md:rounded-lg bg-white shadow-2xl flex flex-col h-[70vh] md:h-[80vh] animate-fade-in-up relative md:mb-0 mb-4 md:ml-0 ml-4">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="font-bold text-lg text-primary">NousCloud Chatbot</div>
                            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-primary">
                                <X size={22} />
                            </button>
                        </div>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-gray-50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 mt-8">How can I help you today?</div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm shadow ${msg.role === "user" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        {/* Input */}
                        <div className="p-4 border-t flex gap-2 bg-white">
                            <input
                                type="text"
                                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Type your message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                disabled={loading}
                                autoFocus
                            />
                            <button
                                className="bg-primary text-white px-4 py-2 rounded font-semibold disabled:opacity-60"
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;
