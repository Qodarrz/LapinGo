import { useState } from "react";
import NotificationWidget from "../widgets/NotificationWidget";
import SearchBar from "../widgets/SearchBar";

export default function Header() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <img src="/images/logo.png" alt="Logo" className="w-10" />
                    <h1 className="font-bold text-sm">
                        Selamat Siang, <br />Farhan 👋
                    </h1>
                </div>
                <NotificationWidget />
            </div>
            {/* Search Bar */}
            <div className="">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeHolder="Apa Yang Anda Cari Hari Ini?"
                />
            </div>
        </div>

    )
}