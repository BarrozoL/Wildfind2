import type { LatLngExpression } from 'leaflet';
import { PropsWithChildren } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const centerPT: LatLngExpression = [39.5, -8.0];
const ZOOM = 6;

export default function LeafletMap({ children }: PropsWithChildren) {
    const key = import.meta.env.VITE_MAPTILER_KEY as string | undefined;
    const url = key
        ? `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${key}`
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    return (
        <MapContainer
            center={centerPT}
            zoom={ZOOM}
            minZoom={4}
            maxZoom={18}
            style={{ height: 'calc(100vh - 64px)', width: '100%' }}
        >
            <TileLayer url={url} attribution="&copy; OpenStreetMap, MapTiler" />
            {children}
        </MapContainer>
    );
}
