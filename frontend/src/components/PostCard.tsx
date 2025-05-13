import { useState } from "react";
import { MessageCircle, Heart, Repeat2, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
    username: string;
    time: string;
    content: string;
    tags: string[];
    comment: {
        username: string;
        content: string;
        time: string;
    };
}

const dummyPost: Post = {
    username: "Dika Hadi Permana",
    time: "5 Hours Ago",
    content:
        "Sering merasa pusing tiba-tiba? 😵 Bisa jadi tubuhmu memberi sinyal kelelahan atau bahkan tekanan darah tidak stabil! Jangan abaikan gejalanya—istirahat cukup, minum air putih, dan segera cek kesehatan jika pusing terus berulang. Stay healthy!",
    tags: ["#Kesehatan", "#CekKesehatan", "#Pusing"],
    comment: {
        username: "Dika Hadi Permana",
        content:
            "emang dasar pemerintah harus ganti ke pa anis sekarang juga 😵‍💫😤😤😤",
        time: "5 Hours Ago",
    },
};

export default function PostCard() {
    const [showComment, setShowComment] = useState(false);

    return (
        <div className="p-2 rounded-lg shadow">
            <div className="flex items-start gap-3">
                <img
                    src="https://i.pravatar.cc/50?img=12"
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div className="flex flex-col mb-2">
                            <h2 className="font-semibold">{dummyPost.username}</h2>
                            <span className="text-sm text-gray-400">{dummyPost.time}</span>
                        </div>
                        <div className="flex items-center">
                            <MoreHorizontal />
                        </div>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed">{dummyPost.content}</p>

                    <div className="mt-1 text-blue-400 text-sm flex flex-wrap gap-1">
                        {dummyPost.tags.map((tag, i) => (
                            <span key={i}>{tag}</span>
                        ))}
                    </div>

                    <div className="flex gap-6 mt-4 text-sm text-gray-400 items-center">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                            <Heart size={16} />
                            <span>146</span>
                        </div>
                        <div
                            className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                            onClick={() => setShowComment(!showComment)}
                        >
                            <MessageCircle size={16} />
                            <span>146</span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                            <Repeat2 size={16} />
                            <span>146</span>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showComment && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="rounded-md p-3 mt-4 shadow">
                                    <div className="flex items-start gap-2">
                                        <img
                                            src="https://i.pravatar.cc/40?img=12"
                                            alt="profile"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <div className="flex flex-col">
                                                    <h3 className="text-sm font-semibold">
                                                        {dummyPost.comment.username}
                                                    </h3>
                                                    <span className="text-xs text-gray-400">
                                                        {dummyPost.comment.time}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <MoreHorizontal />
                                                </div>
                                            </div>
                                            <p className="text-sm mt-1">
                                                {dummyPost.comment.content}
                                            </p>
                                            <div className="flex gap-6 mt-4 text-sm text-gray-400 items-center">
                                                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                                                    <Heart size={16} />
                                                    <span>146</span>
                                                </div>
                                                <div
                                                    className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                                                    onClick={() => setShowComment(!showComment)}
                                                >
                                                    <MessageCircle size={16} />
                                                    <span>146</span>
                                                </div>
                                                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                                                    <Repeat2 size={16} />
                                                    <span>146</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
