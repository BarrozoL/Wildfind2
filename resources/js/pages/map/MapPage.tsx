import LeafletMap from '@/components/map/LeafletMap';
import type { BBox, Feature, Point } from 'geojson';
import L, { DivIcon, LatLngBounds } from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    CircleMarker,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from 'react-leaflet';
import Supercluster from 'supercluster';

// --- helpers (local, so this file works standalone)
async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
    return res.json() as Promise<T>;
}
function useDebounce<T>(value: T, delay = 350) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
}

//For filtering
type SpeciesItem = {
    id: number;
    scientific_name: string;
    common_name?: string | null;
};

// --- API types
type Sighting = {
    id: number;
    species_id: number | null;
    lat: number;
    lng: number;
    observed_at: string;
};
type ApiResponse = { items: Sighting[] };
type Props = {}; // Inertia page can pass props later

// --- Map viewport tracker
function ViewportTracker({
    onChange,
}: {
    onChange: (b: LatLngBounds, z: number) => void;
}) {
    const map = useMap();
    useEffect(() => {
        onChange(map.getBounds(), map.getZoom());
    }, []); // initial
    useMapEvents({
        moveend() {
            onChange(map.getBounds(), map.getZoom());
        },
        zoomend() {
            onChange(map.getBounds(), map.getZoom());
        },
    });
    return null;
}

// --- Cluster icon
function clusterIcon(count: number): DivIcon {
    return L.divIcon({
        html: `<div style="background:rgba(0,122,255,.85);color:#fff;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.25)">${count}</div>`,
        className: '',
        iconSize: [34, 34],
    });
}

// --- Main page
export default function MapPage(_props: Props) {
    const [bounds, setBounds] = useState<LatLngBounds | null>(null);
    const [zoom, setZoom] = useState<number>(6);
    const [items, setItems] = useState<Sighting[]>([]);
    const [loading, setLoading] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const [species, setSpecies] = useState<SpeciesItem[]>([]);
    const [speciesId, setSpeciesId] = useState<number | ''>('');
    const [from, setFrom] = useState<string>(''); // YYYY-MM-DD
    const [to, setTo] = useState<string>(''); // YYYY-MM-DD

    // for the url
    useEffect(() => {
        const u = new URL(window.location.href);
        const sp = u.searchParams.get('species_id');
        const f = u.searchParams.get('from');
        const t = u.searchParams.get('to');
        if (sp) setSpeciesId(Number(sp));
        if (f) setFrom(f);
        if (t) setTo(t);
    }, []);

    // url changing with selected filter option
    useEffect(() => {
        const u = new URL(window.location.href);
        const set = (k: string, v?: string) =>
            v ? u.searchParams.set(k, v) : u.searchParams.delete(k);
        set('species_id', speciesId === '' ? undefined : String(speciesId));
        set('from', from || undefined);
        set('to', to || undefined);
        if (bounds) {
            set('z', String(Math.round(zoom)));
            set(
                'c',
                `${bounds.getCenter().lat.toFixed(5)},${bounds.getCenter().lng.toFixed(5)}`,
            );
        }
        window.history.replaceState({}, '', u.toString());
    }, [speciesId, from, to, bounds, zoom]);

    useEffect(() => {
        getJSON<{ items: SpeciesItem[] }>('/api/species').then((r) =>
            setSpecies(r.items),
        );
    }, []);

    const debouncedBounds = useDebounce(bounds, 350);

    // Fetch BBOX data when viewport settles
    useEffect(() => {
        if (!debouncedBounds) return;
        const b = debouncedBounds;

        // pad a little to avoid edge “popping”
        const pad = 0.15;
        const minLng = b.getWest() - pad;
        const minLat = b.getSouth() - pad;
        const maxLng = b.getEast() + pad;
        const maxLat = b.getNorth() + pad;

        const params = new URLSearchParams({
            minLng: String(minLng),
            minLat: String(minLat),
            maxLng: String(maxLng),
            maxLat: String(maxLat),
        });
        if (speciesId !== '') params.set('species_id', String(speciesId));
        if (from && to) {
            params.set('from', from);
            params.set('to', to);
        }

        const url = `/api/map/sightings?${params.toString()}`;

        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        setLoading(true);
        getJSON<ApiResponse>(url, ac.signal)
            .then((data) => setItems(data.items))
            .catch((e) => {
                if ((e as any).name !== 'AbortError') console.error(e);
            })
            .finally(() => setLoading(false));
    }, [debouncedBounds]);

    // Convert to GeoJSON for supercluster

    type PropsGJ = {
        id: number;
        species_id: number | null;
        observed_at: string;
    };
    const points: Feature<Point, PropsGJ>[] = useMemo(
        () =>
            items.map((s) => ({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
                properties: {
                    id: s.id,
                    species_id: s.species_id,
                    observed_at: s.observed_at,
                    common_name: (s as any).common_name,
                    scientific_name: (s as any).scientific_name,
                },
            })),
        [items],
    );

    // Build cluster index once; reload data when points change
    const indexRef = useRef(
        new Supercluster<PropsGJ>({ radius: 60, maxZoom: 16 }),
    );
    useEffect(() => {
        indexRef.current = new Supercluster<PropsGJ>({
            radius: 60,
            maxZoom: 16,
        });
        indexRef.current.load(points as any); // types are compatible with GeoJSON Feature
    }, [points]);

    // Compute clusters for current viewport+zoom
    const clusters = useMemo(() => {
        if (!bounds) return [];
        const b: BBox = [
            bounds.getWest(),
            bounds.getSouth(),
            bounds.getEast(),
            bounds.getNorth(),
        ];
        return indexRef.current.getClusters(b, Math.round(zoom));
    }, [bounds, zoom, points]); // depend on points so the index reloads first

    return (
        <div className="p-0">
            <div className="flex h-16 items-center gap-3 px-4">
                <h1 className="text-xl font-semibold">Mapa</h1>
                {loading && (
                    <span className="text-sm opacity-70">a carregar…</span>
                )}
                <div className="ml-auto flex items-center gap-2">
                    <button
                        className="cursor-pointer rounded border px-2 py-1"
                        onClick={() => {
                            setSpeciesId('');
                            setFrom('');
                            setTo('');
                        }}
                    >
                        Limpar
                    </button>

                    <button
                        className="cursor-pointer rounded border px-2 py-1"
                        onClick={() => {
                            const toD = new Date();
                            const fromD = new Date();
                            fromD.setDate(toD.getDate() - 7);
                            setFrom(fromD.toISOString().slice(0, 10));
                            setTo(toD.toISOString().slice(0, 10));
                        }}
                    >
                        Últimos 7 dias
                    </button>

                    <button
                        className="cursor-pointer rounded border px-2 py-1"
                        onClick={() => {
                            const toD = new Date();
                            const fromD = new Date();
                            fromD.setDate(toD.getDate() - 30);
                            setFrom(fromD.toISOString().slice(0, 10));
                            setTo(toD.toISOString().slice(0, 10));
                        }}
                    >
                        Últimos 30 dias
                    </button>

                    <select
                        className="cursor-pointer rounded border px-2 py-1"
                        value={speciesId}
                        onChange={(e) =>
                            setSpeciesId(
                                e.target.value ? Number(e.target.value) : '',
                            )
                        }
                    >
                        <option value="">Todas as espécies</option>
                        {species.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.common_name ?? s.scientific_name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        className="rounded border px-2 py-1"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                    <span className="opacity-60">→</span>
                    <input
                        type="date"
                        className="rounded border px-2 py-1"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                </div>
            </div>

            <LeafletMap>
                <ViewportTracker
                    onChange={(b, z) => {
                        setBounds(b);
                        setZoom(z);
                    }}
                />
                <ClusterMarkers
                    clusters={clusters}
                    getExpansionZoom={(id: number) =>
                        indexRef.current.getClusterExpansionZoom(id)
                    }
                />
            </LeafletMap>
        </div>
    );
}

// Renders cluster bubbles as Markers and single points as CircleMarkers
function ClusterMarkers({
    clusters,
    getExpansionZoom,
}: {
    clusters: any[];
    getExpansionZoom: (id: number) => number;
}) {
    const map = useMap();

    return (
        <>
            {clusters.map((c: any) => {
                const [lng, lat] = c.geometry.coordinates as [number, number];
                const isCluster = !!c.properties.cluster;

                if (isCluster) {
                    const count = c.properties.point_count as number;
                    return (
                        <Marker
                            key={`c-${c.id}`}
                            position={[lat, lng]}
                            icon={clusterIcon(count)}
                            eventHandlers={{
                                click: () => {
                                    const nextZoom = getExpansionZoom(c.id);
                                    map.setView([lat, lng], nextZoom, {
                                        animate: true,
                                    });
                                },
                            }}
                        />
                    );
                }

                const id = c.properties.id as number;
                const speciesId = c.properties.species_id as number | null;
                const observedAt = c.properties.observed_at as string;

                const cn = c.properties.common_name as string | undefined;
                const sc = c.properties.scientific_name as string | undefined;

                return (
                    <CircleMarker
                        key={`p-${id}`}
                        center={[lat, lng]}
                        radius={5}
                        stroke
                        weight={1}
                        opacity={0.9}
                        fillOpacity={0.9}
                    >
                        <Popup>
                            <div className="text-sm">
                                <div className="font-medium">
                                    {cn ?? sc ?? 'Espécie desconhecida'}
                                </div>
                                {cn && sc && (
                                    <div className="italic opacity-70">
                                        {sc}
                                    </div>
                                )}
                                <div>
                                    <b>Observado:</b>{' '}
                                    {new Date(observedAt).toLocaleString()}
                                </div>
                                <a
                                    className="text-blue-600 underline"
                                    href={`/sightings/${id}`}
                                >
                                    Ver detalhe
                                </a>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </>
    );
}
