import { useRef, useState, useEffect, useCallback } from "react";

interface Report {
    id: number | string;
    image: string;
    title: string;
    note: string;
}

interface CardSliderProps {
    dummyReports: Report[];
}

export default function CardSlider({ dummyReports }: CardSliderProps) {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const cardWidth = 250 + 16; // Lebar kartu + gap-4 (16px)

    // Scroll ke index tertentu
    const handleDotClick = (index: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: index * cardWidth,
                behavior: "smooth",
            });
            setCurrentIndex(index);
        }
    };

    // Gunakan useCallback agar aman di dependency array
    const handleScroll = useCallback(() => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const index = Math.round(scrollLeft / cardWidth);
            setCurrentIndex(index);
        }
    }, [cardWidth]);

    useEffect(() => {
        const ref = scrollRef.current;
        if (!ref) return;

        ref.addEventListener("scroll", handleScroll);
        return () => {
            ref.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <div>
            {/* Card Slider */}
            <div
                ref={scrollRef}
                className="overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
            >
                <div className="flex gap-4 pr-10">
                    {dummyReports.map((report) => (
                        <div
                            key={report.id}
                            className="flex-shrink-0 w-[250px] rounded-xl shadow-md p-4 flex items-center gap-4 snap-start"
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


            {/* Dots */}
            <div className="flex justify-center mt-4 gap-2">
                {dummyReports.map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${idx === currentIndex ? "bg-gray-800" : "bg-gray-300"
                            }`}
                        onClick={() => handleDotClick(idx)}
                    ></button>
                ))}
            </div>
        </div>
    );
}
