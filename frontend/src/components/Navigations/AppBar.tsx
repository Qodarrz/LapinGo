import { NavLink } from "react-router-dom";
import { Home, FileText, Users, InfoIcon } from "lucide-react";

const navItems = [
    { name: "Beranda", to: "/", icon: <Home size={28} /> },
    { name: "Laporan", to: "/laporan", icon: <FileText size={28} /> },
    { name: "Komunitas", to: "/komunitas", icon: <Users size={28} /> },
    { name: "Profil", to: "/profile", icon: <InfoIcon size={28} /> },
];

export default function AppBar() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-secondary z-50">
            <div className="px-6 py-3 pb-6 max-w-md mx-auto">
                <ul className="flex justify-between items-center">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center text-xs rounded-xl transition-colors p-2 duration-200 ${isActive ? "text-primary bg-primary/15 font-semibold" : "text-gray-500"
                                }`
                            }
                        >
                            <div>{item.icon}</div>
                            <span className="mt-1">{item.name}</span>
                        </NavLink>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
