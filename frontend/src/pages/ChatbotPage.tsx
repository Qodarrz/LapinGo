import { ChevronLeft, MoreVertical, Search, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function ChatbotPage() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, text: "Apa benar farhan itu gay?", sender: "user", time: "12:17 AM" },
        { id: 2, text: "Pertanyaan bagus, berdasarkan jurnal yang diterbitkan tahun 6969 farhan adalah gay", sender: "ai", time: "12:17 AM" },
    ]);
    const [input, setInput] = useState("");

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([
            ...messages,
            {
                id: Date.now(),
                text: input,
                sender: "user",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
        ]);
        setInput("");
    };

    return (
        <div className="bg-[#f2f6fb] text-text min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white flex justify-between items-center p-4">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)}>
                        <ChevronLeft size={28} />
                    </button>
                    <h1 className="font-bold text-lg">LapinAI</h1>
                </div>
                <MoreVertical />
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 flex flex-col gap-4 justify-end">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className="flex flex-col max-w-[75%]">
                            <div
                                className={`px-4 py-2 text-sm rounded-lg ${msg.sender === "user"
                                        ? "bg-white text-black rounded-br-none"
                                        : "bg-primary text-white rounded-bl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                            <span
                                className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-right text-gray-400 pr-1" : "text-left text-gray-300 pl-1"
                                    }`}
                            >
                                {msg.time}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white p-4 flex items-center">
                <input
                    type="text"
                    placeholder="Input Your Prompt Here"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 bg-primary/15 rounded-lg px-4 py-2 text-sm outline-none"
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 p-2 bg-primary rounded-lg text-white"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
