import { Bell, ChevronRight, CircleHelp, Edit, Palette, Share2, UserPen } from "lucide-react";
import { Link } from "react-router-dom";
import ChatBot from "../components/ChatBot";

const menuItems = [
    { label: "Edit Akun", icon: <UserPen size={32} />, link: "/edit-akun" },
    { label: "Tema", icon: <Palette size={32} />, link: "/ubah-password" },
    { label: "Notifikasi", icon: <Bell size={32} />, link: "/riwayat" },
    { label: "Bantuan", icon: <CircleHelp size={32} />, link: "/pengaturan-lain" },
];

export default function ProfilePage() {
    return (
        <div className="bg-background text-text min-h-screen p-6">
            <h1 className="text-lg font-semibold text-center">Profile</h1>
            <div className="flex justify-between my-4">
                <div className="flex gap-4">
                    <img
                        src="/images/profile.jpg"
                        alt="Profile"
                        className="object-cover rounded-full w-14 h-14"
                    />
                    <div className="flex flex-col">
                        <h1 className="font-bold text-lg">Ucup</h1>
                        <h2 className="text-textBody">ucup@email.com</h2>
                    </div>
                </div>
                <div className="flex items-center text-textBody hover:text-text transition-all cursor-pointer">
                    <Edit size={24} />
                </div>
            </div>

            {/* STREAK */}
            <div className="flex w-full gap-4">
                <div className="flex flex-1 flex-col justify-center items-center gap-4 bg-secondary p-6 rounded-lg shadow-md">
                    <h2 className="font-bold">Streak Saat ini</h2>
                    <div className="flex justify-center items-center gap-2">
                        <img src="/images/api.svg" alt="" />
                        <h1 className="text-lg font-bold">3</h1>
                    </div>
                    <div className="flex items-center text-[#FF6723] gap-2">
                        <Share2 />
                        <h2>Bagikan</h2>
                    </div>
                </div>

                <div className="flex flex-1 flex-col justify-center items-center gap-4 bg-secondary p-6 rounded-lg shadow-md">
                    <h2 className="font-bold">Streak Saat ini</h2>
                    <div className="flex justify-center items-center gap-2">
                        <img src="/images/apiUngu.svg" alt="" />
                        <h1 className="text-lg font-bold">3</h1>
                    </div>
                    <div className="flex items-center text-[#AF2EFF] gap-2">
                        <Share2 />
                        <h2>Bagikan</h2>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-8">
                {menuItems.map((item, index) => (
                    <Link
                        to={item.link}
                        key={index}
                        className="flex justify-between items-center p-2 shadow-mc rounded-lg text-primary cursor-pointer hover:bg-gray-100"
                    >
                        <div className="flex gap-4 items-center">
                            {item.icon}
                            <h2 className="text-lg font-semibold text-text">{item.label}</h2>
                        </div>
                        <ChevronRight size={28} />
                    </Link>
                ))}
            </div>

            <ChatBot />
        </div>
    )
}