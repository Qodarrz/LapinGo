import { Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeHolder: string;
}

export default function SearchBar({ value, onChange, placeHolder }: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);
    const isActive = isFocused || value.length > 0;

    return (
        <div className="w-full relative">
            <input
                type="text"
                className="w-full px-12 py-3 rounded-xl border border-text placeholder-transparent text-textBody"
                value={value}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => onChange(e.target.value)}
            />

            {/* Placeholder fade animation */}
            <AnimatePresence>
                {!isActive && (
                    <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{duration: 0.1, ease: "easeInOut"}}
                        className="absolute left-4 top-3 text-textBody pointer-events-none"
                    >
                        {placeHolder}
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Search icon animation */}
            <motion.div
                animate={{
                    left: isActive ? '1rem' : 'auto',
                    right: isActive ? 'auto' : '1rem'
                }}
                transition={{ duration: 0.2, ease: "easeIn" }}
                className="absolute top-3 text-textBody"
            >
                <Search size={20} />
            </motion.div>
        </div>
    );
}
