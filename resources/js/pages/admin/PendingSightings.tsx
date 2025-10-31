import { Link, router, usePage } from '@inertiajs/react';

type Item = {
    id: number;
    user?: { id: number; name: string; email: string };
    species?: { id: number; name: string };
    lat: number;
    lng: number;
    observed_at?: string | null;
    note?: string | null;
    thumb?: string | null;
};

type PageProps = {
    items: {
        data: Item[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

export default function PendingSightings({ items }: PageProps) {
    const { props } = usePage();

    function approve(id: number) {
        router.post(
            `/admin/sightings/${id}/verify`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => router.reload({ only: ['items'] }),
            },
        );
    }

    function removeItem(id: number) {
        if (!confirm('Remover este avistamento?')) return;
        router.delete(`/admin/sightings/${id}`, { preserveScroll: true });
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Pendentes</h1>
                <Link href="/map" className="text-blue-600 underline">
                    Ver mapa
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {items.data.map((it) => (
                    <div
                        key={it.id}
                        className="flex items-start gap-4 rounded border p-4"
                    >
                        {it.thumb ? (
                            <img
                                src={it.thumb}
                                alt=""
                                className="h-32 w-32 rounded object-cover"
                            />
                        ) : (
                            <div className="flex h-32 w-32 items-center justify-center rounded bg-gray-100 text-sm">
                                Sem foto
                            </div>
                        )}

                        <div className="flex-1">
                            <div className="font-medium">
                                #{it.id}{' '}
                                {it.species?.name ?? 'Não identificada'}
                            </div>
                            <div className="text-sm opacity-80">
                                {it.user?.name} &lt;{it.user?.email}&gt;
                            </div>
                            <div className="mt-1 text-sm">
                                {it.observed_at
                                    ? new Date(it.observed_at).toLocaleString()
                                    : '—'}
                                {' · '}lat: {it.lat.toFixed(5)} / lng:{' '}
                                {it.lng.toFixed(5)}
                            </div>
                            {it.note && (
                                <div className="mt-2 text-sm">{it.note}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => approve(it.id)}
                                className="rounded bg-emerald-600 px-3 py-2 text-white"
                            >
                                Aprovar
                            </button>
                            <button
                                onClick={() => removeItem(it.id)}
                                className="rounded border px-3 py-2"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* paginação simples */}
            <div className="flex justify-center gap-2">
                {items.links.map((l, i) => (
                    <Link
                        key={i}
                        href={l.url || '#'}
                        className={`rounded border px-3 py-1 ${l.active ? 'bg-gray-200' : ''}`}
                        preserveScroll
                    >
                        {l.label
                            .replace('&laquo;', '«')
                            .replace('&raquo;', '»')}
                    </Link>
                ))}
            </div>
        </div>
    );
}
