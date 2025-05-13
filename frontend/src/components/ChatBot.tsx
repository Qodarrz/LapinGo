import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChatBot() {

    return (
        <Link
            to={"/chatbot"}
            className="fixed bottom-28 right-6 z-50 bg-primary text-textDark rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
        >
            <MessageCircle className="w-6 h-6" />
        </Link>
    );
}
