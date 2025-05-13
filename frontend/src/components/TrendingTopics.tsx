export default function TrendingTopics() {
    const topics = [
        "#Sampah Kota",
        "#WifiTaman",
        "#Macet",
        "#JalanJebol",
        "#BuangSampahSungai",
    ];

    return (
        <>
            <h1 className="text-lg font-bold">Topik yang lagi Trend</h1>
            <div className="flex flex-wrap gap-2">
                <button className="bg-primary text-white px-4 py-1 rounded-full text-sm">Semua</button>
                {topics.map((topic, index) => (
                    <button key={index} className="border border-primary text-primary px-4 py-1 rounded-full text-sm hover:text-white hover:bg-primary">
                        {topic}
                    </button>
                ))}
            </div>
        </>
    );
}
