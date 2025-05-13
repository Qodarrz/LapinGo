import { ArrowRight, BotIcon } from "lucide-react";
import Header from "../components/Navigations/Header";
import ReportCardSlider from "../components/cards/ReportCardSlider";
import { Link } from "react-router-dom";

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
	{
		id: 4,
		title: "Laskar Pelangi",
		image: "/images/about4.jpg",
		note: "Telat 2 hari, Segera kembalikan buku",
	},
	{
		id: 5,
		title: "Laskar Pelangi",
		image: "/images/about4.jpg",
		note: "Telat 2 hari, Segera kembalikan buku",
	},
];

export default function HomePage() {

	return (
		<div className="bg-background min-h-screen text-text p-6 space-y-6">
			{/* Header */}
			<Header />

			{/* Icon Menu */}
			<div className="grid grid-cols-4 gap-4 text-center">
				{["LapinAI", "LapinCoin", "Artikel", "Artikel"].map((item, i) => (
					<div key={i} className="flex flex-col items-center">
						<div className="bg-secondary p-4 rounded-full">
							<BotIcon size={32} />
						</div>
						<span className="text-sm mt-1">{item}</span>
					</div>
				))}
			</div>

			{/* Progres Laporan */}
			<div className="w-full overflow-hidden">
				<div className="flex justify-between items-center">
					<h2 className="font-semibold">Laporan yang sedang Proses</h2>
					<a href="#" className="text-sm text-textBody">
						Lihat Semua
					</a>
				</div>

				<ReportCardSlider dummyReports={dummyReports}/>
			</div>

			{/* Lapor Keluhan */}
			<div className="flex items-center gap-4 p-4">
				<img
					src="/images/home.png"
					alt="Laporan"
					className="object-contain"
				/>
				<div className="flex flex-col gap-2">
					<h3 className="font-semibold text-lg">
						Ayo Laporkan Keluhan Anda Tentang Kota Bogor
					</h3>
					<Link to={"/lapor"} className="text-sm flex items-center">
						Lapor Sekarang <span className="ml-1"><ArrowRight size={18} /></span>
					</Link>
				</div>
			</div>
		</div>
	);
}