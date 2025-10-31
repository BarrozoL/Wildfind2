// resources/js/components/map/MiniMap.tsx
import LeafletMap from '@/components/map/LeafletMap';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/** Invalidate size after first paint so Leaflet recalculates tiles & gestures */
function InvalidateOnMount() {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 0);
    }, [map]);
    return null;
}

type MiniMapProps = {
    children?: React.ReactNode; // optional: pass your clusters, viewport tracker, etc.
    className?: string;
};

export default function MiniMap({ children, className }: MiniMapProps) {
    return (
        <LeafletMap
            zoom={6}
            // ✅ INTERACTIONS ON (same as your main map)
            scrollWheelZoom={true}
            dragging={true}
            doubleClickZoom={true}
            zoomControl={true}
            // ✅ CONTAINED TO THE CARD
            style={{ width: '100%', height: '100%' }}
            className={className ?? 'h-full w-full overflow-hidden rounded-2xl'}
        >
            <InvalidateOnMount />
            {children}
        </LeafletMap>
    );
}
