import { Link, useForm } from '@inertiajs/react';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

type SpeciesItem = {
    id: number;
    scientific_name: string;
    common_name?: string | null;
};
type PageProps = { species: SpeciesItem[]; now: string };

export default function Create({ species, now }: PageProps) {
    const { data, setData, post, processing, errors, progress, transform } =
        useForm<{
            photo: File | null;
            observed_at: string;
            lat: string;
            lng: string;
            species_id: string;
            note: string;
        }>({
            photo: null,
            observed_at: now,
            lat: '',
            lng: '',
            species_id: '',
            note: '',
        });

    // Keep multipart behavior (Inertia detects File & sends FormData)
    transform((data) => data);

    const [preview, setPreview] = useState<string | null>(null);

    function onFile(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] ?? null;
        setData('photo', f);
        setPreview(f ? URL.createObjectURL(f) : null);
    }

    function geolocate() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            setData('lat', String(pos.coords.latitude));
            setData('lng', String(pos.coords.longitude));
        });
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/sightings', { forceFormData: true });
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Criar Avistamento</h1>
                <Link href="/map" className="text-blue-600 underline">
                    Voltar ao mapa
                </Link>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium">Foto *</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFile}
                        className="mt-1"
                    />
                    {progress && (
                        <div className="mt-2 text-sm">
                            {progress.percentage}%
                        </div>
                    )}
                    {errors.photo && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.photo}
                        </p>
                    )}
                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            className="mt-3 max-h-48 rounded"
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium">
                            Data/Hora *
                        </label>
                        <input
                            type="datetime-local"
                            value={data.observed_at}
                            onChange={(e) =>
                                setData('observed_at', e.target.value)
                            }
                            className="mt-1 w-full rounded border px-2 py-1"
                        />
                        {errors.observed_at && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.observed_at}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Espécie (opcional)
                        </label>
                        <select
                            className="mt-1 w-full rounded border px-2 py-1"
                            value={data.species_id}
                            onChange={(e) =>
                                setData('species_id', e.target.value)
                            }
                        >
                            <option value="">— Não identificada —</option>
                            {species.map((s) => (
                                <option key={s.id} value={String(s.id)}>
                                    {s.common_name ?? s.scientific_name}
                                </option>
                            ))}
                        </select>
                        {errors.species_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.species_id}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Nota</label>
                    <textarea
                        className="mt-1 w-full rounded border px-2 py-1"
                        rows={3}
                        value={data.note}
                        onChange={(e) => setData('note', e.target.value)}
                    />
                    {errors.note && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.note}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium">
                            Lat *
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            className="mt-1 w-full rounded border px-2 py-1"
                            value={data.lat}
                            onChange={(e) => setData('lat', e.target.value)}
                        />
                        {errors.lat && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.lat}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Lng *
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            className="mt-1 w-full rounded border px-2 py-1"
                            value={data.lng}
                            onChange={(e) => setData('lng', e.target.value)}
                        />
                        {errors.lng && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.lng}
                            </p>
                        )}
                    </div>
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={geolocate}
                            className="w-full rounded border px-3 py-2"
                        >
                            Usar minha localização
                        </button>
                    </div>
                </div>

                <MiniPicker
                    lat={data.lat}
                    lng={data.lng}
                    onPick={(lat, lng) => {
                        setData('lat', String(lat));
                        setData('lng', String(lng));
                    }}
                />

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                        {processing ? 'A enviar...' : 'Criar'}
                    </button>
                    <Link href="/map" className="rounded border px-4 py-2">
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}

function MiniPicker({
    lat,
    lng,
    onPick,
}: {
    lat: string;
    lng: string;
    onPick: (lat: number, lng: number) => void;
}) {
    const center: LatLngExpression =
        lat && lng ? [Number(lat), Number(lng)] : [39.5, -8.0];

    function Clicker() {
        useMapEvents({
            click(e) {
                onPick(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    }

    const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    return (
        <div className="mt-2">
            <MapContainer
                center={center}
                zoom={lat && lng ? 12 : 6}
                style={{ height: 300, width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Clicker />
                {lat && lng && (
                    <Marker position={[Number(lat), Number(lng)]} icon={icon} />
                )}
            </MapContainer>
        </div>
    );
}
