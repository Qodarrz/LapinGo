import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const defaultPosition: [number, number] = [-6.200000, 106.816666]; // Jakarta

function LocationMarker({ onChange }: { onChange: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
            onChange(e.latlng.lat, e.latlng.lng);
        },
    });

    return position ? (
        <Marker
            position={position}
            icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png' })}
        />
    ) : null;
}

export default function ReportFormPage() {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [problemType, setProblemType] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="bg-background text-text relative text-center p-6 space-y-4 min-h-screen">
            {/* Tombol Close */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 right-4 text-2xl w-8 h-8 flex items-center justify-center"
                aria-label="Tutup Form"
            >
                &times;
            </button>

            {/* Header */}
            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold">Lapor Masalah</h2>
                <p className="text-xs text-textBody">
                    Silakan unggah foto, pilih lokasi, dan berikan detail masalah yang ingin Anda laporkan kepada pemerintah atau instansi terkait.
                </p>
            </div>

            {/* Upload Foto */}
            <div className="flex flex-col">
                <div className="flex items-center justify-center gap-2">
                    <hr className="w-[20%]" />
                    <label className="text-sm font-medium mb-1 whitespace-nowrap">Upload Foto</label>
                    <hr className="w-[20%]" />
                </div>
                <label
                    htmlFor="uploadFile1"
                    className="bg-white text-slate-500 w-full font-semibold text-base rounded-lg mt-3 h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-text border-dashed mx-auto"
                >
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-3 fill-gray-500" viewBox="0 0 32 32">
                            <path
                                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                            />
                            <path
                                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                            />
                        </svg>
                        <h2 className="text-sm font-medium">Upload file</h2>
                        <p className="text-xs font-medium text-textBody mt-2">
                            PNG, JPG, SVG, WEBP, dan GIF diperbolehkan.
                        </p>
                    </div>

                    <input type="file" id="uploadFile1" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            </div>

            {/* Map */}
            <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <hr className="w-[20%]" />
                    <label className="text-sm font-medium mb-1 whitespace-nowrap">Pilih Lokasi</label>
                    <hr className="w-[20%]" />
                </div>
                <MapContainer
                    center={defaultPosition}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: '200px', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker onChange={(lat, lng) => setLocation({ lat, lng })} />
                </MapContainer>
            </div>

            {/* Jenis Masalah */}
            <div className="text-left">
                <label className="font-medium mb-1">Jenis Masalah</label>
                <select
                    className="w-full border border-text rounded-md p-2"
                    value={problemType}
                    onChange={(e) => setProblemType(e.target.value)}
                >
                    <option value="">Pilih Jenis Masalah</option>
                    <option value="jalan">Jalan Rusak</option>
                    <option value="sampah">Sampah Menumpuk</option>
                    <option value="lampu">Lampu Jalan Mati</option>
                </select>
            </div>

            {/* Estimasi Waktu */}
            <div className="text-left">
                <label className="font-medium mb-1">Estimasi Waktu Terjadi</label>
                <input
                    type="date"
                    className="w-full border border-text rounded-md p-2"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            {/* Deskripsi */}
            <div className="text-left">
                <label className="font-medium mb-1">Deskripsi</label>
                <textarea
                    className="w-full border border-text rounded-md p-2 text-sm"
                    rows={5}
                    placeholder="Jelaskan masalah Anda secara detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {/* Tombol Verifikasi */}
            <div className="space-y-2">
                <button className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition">
                    Verifikasi Normal
                </button>
                <p className="text-xs text-textBody whitespace-nowrap">
                    Estimasi verifikasi 1–7 hari untuk validasi oleh tim lapangan.
                </p>
                <button className="w-full border border-sky-500 text-sky-500 py-2 rounded-md hover:bg-sky-50 transition">
                    Verifikasi Dengan AI
                </button>
                <p className="text-xs text-textBody whitespace-nowrap">Verifikasi cepat menggunakan AI.</p>
            </div>
        </div>
    );
}
