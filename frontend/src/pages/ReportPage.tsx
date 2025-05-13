import { ArrowRight } from "lucide-react";
import Header from "../components/Navigations/Header";
import { Link } from "react-router-dom";
import ChatBot from "../components/ChatBot";

const dummyReports = [
    {
        id: 1,
        title: "Sungai Kotor",
        image: "/images/about4.jpg",
        note: "banyak yang buang sampah disungai",
    },
    {
        id: 2,
        title: "Laskar Pelangi",
        image: "/images/about4.jpg",
        note: "Telat 2 hari, Segera kembalikan buku",
    },
    {
        id: 3,
        title: "Laskar Pelangi",
        image: "/images/about4.jpg",
        note: "Telat 2 hari, Segera kembalikan buku",
    },
];

export default function ReportPage() {
    return (
        <div className="bg-background text-text min-h-screen p-6 space-y-6">
            <Header />

            <div className="flex justify-center items-center gap-4">
                <img
                    src="/images/home.png"
                    alt="Laporan"
                    className="object-contain w-1/2"
                />
                <div className="flex flex-col gap-2 w-1/2">
                    <h3 className="font-semibold text-lg">
                        Ayo Laporkan Keluhan Anda Tentang Kota Bogor
                    </h3>
                    <Link to={"/lapor"} className="text-sm flex items-center">
						Lapor Sekarang <span className="ml-1"><ArrowRight size={18} /></span>
					</Link>
                </div>
            </div>


            <div className="">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold">Laporan Anda Sebelumnya</h2>
                    <a href="#" className="text-sm text-textBody">
                        Lihat Semua
                    </a>
                </div>
                <div className="flex flex-col gap-4">
                    {dummyReports.map((report) => (
                        <div
                            key={report.id}
                            className="shadow-md p-4 flex items-center gap-4"
                        >
                            <img
                                src={report.image}
                                alt={report.title}
                                className="w-20 h-28 rounded-lg object-cover"
                            />
                            <div>
                                <h3 className="font-bold text-lg">{report.title}</h3>
                                <p className="text-sm text-textBody line-clamp-2">{report.note}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ChatBot />
        </div>
    );
}
