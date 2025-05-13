import Header from "../components/Navigations/Header";
import PostCard from "../components/PostCard";
import TrendingTopics from "../components/TrendingTopics";
import ChatBot from "../components/ChatBot";


export default function CommunityPage() {
    return (
        <div className="bg-background text-text min-h-screen pb-12 p-6 space-y-6">
            <Header />

            <div className="flex flex-col gap-4">
                {/* Sortir berdasarkan topik */}
                <TrendingTopics />

                {/* Sortir berdasarkan waktu */}
                <div className="flex gap-2">
                    <button className="bg-primary text-white px-4 py-1 rounded-full text-sm">Semua</button>
                    <button className="text-primary border border-primary hover:bg-primary hover:text-white px-4 py-1 rounded-full text-sm">Semua</button>
                    <button className="text-primary border border-primary hover:bg-primary hover:text-white px-4 py-1 rounded-full text-sm">Semua</button>
                </div>

                {/* Post Section */}
                <div className="flex flex-col gap-4">
                    <PostCard />
                </div>
            </div>

            <ChatBot />
        </div>
    );
}
