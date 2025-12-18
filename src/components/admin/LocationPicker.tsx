"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Check, Loader2 } from 'lucide-react';

// Fix for Leaflet marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (location: { name: string; lat: number; lng: number }) => void;
}

const DraggableMarker = ({ position, setPosition }: { position: L.LatLng, setPosition: (pos: L.LatLng) => void }) => {
    const markerRef = useRef<L.Marker>(null)

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    setPosition(marker.getLatLng())
                }
            },
        }),
        [setPosition],
    )

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    )
}

export default function LocationPicker({ isOpen, onClose, onSelect }: LocationPickerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetchingName, setFetchingName] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setPosition(new L.LatLng(pos.coords.latitude, pos.coords.longitude));
                        setLoading(false);
                    },
                    () => {
                        // Default to Kochi, India if geolocation fails
                        setPosition(new L.LatLng(9.9312, 76.2673));
                        setLoading(false);
                    }
                );
            } else {
                setPosition(new L.LatLng(9.9312, 76.2673));
                setLoading(false);
            }
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        if (!position) return;
        setFetchingName(true);

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Unknown Location';
            const country = data.address.country || '';
            const name = country ? `${city}, ${country}` : city;

            onSelect({
                name,
                lat: position.lat,
                lng: position.lng
            });
            onClose();
        } catch (error) {
            console.error("Failed to fetch location name", error);
            // Fallback
            onSelect({
                name: `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`,
                lat: position.lat,
                lng: position.lng
            });
            onClose();
        } finally {
            setFetchingName(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[500px]">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Select Location</h3>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 relative bg-secondary/20">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50">
                            <Loader2 className="animate-spin" />
                        </div>
                    )}
                    {!loading && position && (
                        <MapContainer
                            center={position}
                            zoom={13}
                            scrollWheelZoom={true}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <DraggableMarker position={position} setPosition={setPosition} />
                        </MapContainer>
                    )}
                </div>

                <div className="p-4 border-t border-border flex justify-end gap-2 bg-card">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 hover:bg-secondary rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={fetchingName || loading}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                    >
                        {fetchingName ? (
                            <><Loader2 size={16} className="animate-spin" /> Fetching Name...</>
                        ) : (
                            <><Check size={16} /> Use this Location</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
