// resources/js/components/map/LeafletMap.tsx
import type { LatLngExpression } from 'leaflet';
import { PropsWithChildren } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const DEFAULT_CENTER: LatLngExpression = [39.5, -8.0];
const DEFAULT_ZOOM = 6;

type LeafletMapProps = PropsWithChildren<{
    center?: LatLngExpression;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    /** let the parent control size (so it fits the card) */
    style?: React.CSSProperties;
    className?: string;

    // interactions you may want to tame for the MiniMap:
    scrollWheelZoom?: boolean;
    dragging?: boolean;
    doubleClickZoom?: boolean;
    zoomControl?: boolean;
}>;

export default function LeafletMap({
    children,
    center = DEFAULT_CENTER,
    zoom = DEFAULT_ZOOM,
    minZoom = 4,
    maxZoom = 18,
    style,
    className,
    scrollWheelZoom = true,
    dragging = true,
    doubleClickZoom = true,
    zoomControl = true,
}: LeafletMapProps) {
    const key = import.meta.env.VITE_MAPTILER_KEY as string | undefined;
    const url = key
        ? `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${key}`
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            minZoom={minZoom}
            maxZoom={maxZoom}
            // ⬇️ for the big map page you used a full-viewport height.
            // Here we let the parent decide. If no style passed, fall back to your old value.
            style={style ?? { height: 'calc(100vh - 64px)', width: '100%' }}
            className={className}
            scrollWheelZoom={scrollWheelZoom}
            dragging={dragging}
            doubleClickZoom={doubleClickZoom}
            zoomControl={zoomControl}
            attributionControl={true}
        >
            <TileLayer url={url} attribution="&copy; OpenStreetMap, MapTiler" />
            {children}
        </MapContainer>
    );
}
