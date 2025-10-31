import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

/**
 * WildFind 2.0 – Landing Page (PT-first)
 * FILE PATH (IMPORTANT): resources/js/Pages/Welcome.tsx
 *
 * This version is deliberately **dependency-free** (no shadcn, no AppShell, no route() helper)
 * so it won’t white-screen if aliases/components aren’t wired yet. It uses only Tailwind classes.
 *
 * Ensure your route is: Route::get('/', fn () => Inertia::render('Welcome'));
 */

export default function Welcome() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Head title="WildFind — Avistamentos em Portugal" />

            <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur dark:bg-black/40">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🌿</span>
                        <span className="text-lg font-semibold">WildFind</span>
                        <span className="ml-2 rounded border px-2 py-0.5 text-xs text-muted-foreground">
                            Your nature identifying app
                        </span>
                    </div>
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            href="/map"
                            className="text-sm font-medium hover:underline"
                        >
                            Map
                        </Link>
                        <Link
                            href="/login"
                            className="text-sm font-medium hover:underline"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm font-medium hover:underline"
                        >
                            Create Account
                        </Link>
                        <AppearanceToggleDropdown />
                    </nav>
                    <div className="md:hidden">
                        <Link
                            href="/map"
                            className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
                        >
                            Explore
                        </Link>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
                    <div>
                        <span className="mb-4 inline-block rounded border px-2 py-0.5 text-xs text-muted-foreground">
                            MVP under construction
                        </span>
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                            Register and discover nature
                        </h1>
                        <p className="mt-4 text-muted-foreground">
                            Upload pictures, tag locations in the map and
                            explore sightings from the community
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/map"
                                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:opacity-90"
                            >
                                <span className="mr-2">📍</span> Explore the map
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-accent"
                            >
                                <span className="mr-2">📷</span> Register
                                sighting
                            </Link>
                        </div>
                        <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                ✅ Basic moderation
                            </div>
                            <div className="flex items-center gap-2">
                                ❤️ Likes
                            </div>
                            <div className="flex items-center gap-2">
                                💬 Comments
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border">
                        <div className="relative aspect-[16/10] w-full">
                            <div className="absolute inset-0 grid place-items-center">
                                <div className="text-center">
                                    <div className="text-6xl">🗺️</div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        React‑Leaflet + supercluster
                                    </p>
                                    <Button
                                        variant="default"
                                        className="text-md mt-3 rounded-xl border p-6"
                                    >
                                        <Link href="/map">Go to Map</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COUNTERS (static placeholders; wire up later) */}
            <section className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard label="Sightings" value="—" />
                    <StatCard label="Species" value="—" />
                    <StatCard label="Naturalists" value="—" />
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="mx-auto max-w-7xl px-4 py-12">
                <h2 className="text-2xl font-bold tracking-tight">
                    How it works
                </h2>
                <p className="mt-1 text-muted-foreground">
                    Simplicity first. No hassle.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <StepCard
                        icon="📷"
                        title="Picture"
                        text="Take a clear picture of an animal or plant."
                    />
                    <StepCard
                        icon="📍"
                        title="Marca no mapa"
                        text="Chose the date/time of the sighting."
                    />
                    <StepCard
                        icon="🍃"
                        title="Share and explore"
                        text="The community interacts with likes and comments."
                    />
                </div>
            </section>

            {/* LATEST SIGHTINGS (placeholder grid) */}
            <section className="mx-auto max-w-7xl px-4 py-12">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Recent sightings
                        </h2>
                        <p className="mt-1 text-muted-foreground">
                            Most recent uploaded sightings.
                        </p>
                    </div>
                    <Link
                        href="/map"
                        className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                        See in the map <span>→</span>
                    </Link>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <article
                            key={i}
                            className="overflow-hidden rounded-2xl border"
                        >
                            <div className="aspect-[4/3] w-full bg-muted" />
                            <div className="p-4">
                                <h3 className="text-base font-semibold">
                                    Unidentified species
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Portugal
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* FEATURED SPECIES (placeholder) */}
            <section className="mx-auto max-w-7xl px-4 py-12">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Highlighted species
                        </h2>
                        <p className="mt-1 text-muted-foreground">
                            Explore the complete list by common or scientific
                            name
                        </p>
                    </div>
                    <a
                        href="#species"
                        className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                        See all <span>→</span>
                    </a>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <article
                            key={i}
                            className="overflow-hidden rounded-2xl border"
                        >
                            <div className="aspect-[4/3] w-full bg-muted" />
                            <div className="p-4">
                                <h3 className="text-base font-semibold">
                                    Species
                                </h3>
                                <p className="text-sm text-muted-foreground italic">
                                    Scientific name
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-7xl px-4 py-16">
                <div className="rounded-2xl border p-6 md:p-10">
                    <div className="grid items-center gap-6 md:grid-cols-2">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">
                                Ready to participate?
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                                Create a free account and start registering
                                nature around you.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 md:justify-end">
                            <Link
                                href="/register"
                                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:opacity-90"
                            >
                                Create account
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-accent"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t py-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
                    <p>
                        © {new Date().getFullYear()} WildFind — Made in
                        Portugal
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="hover:underline">
                            Home
                        </Link>
                        <Link href="/map" className="hover:underline">
                            Map
                        </Link>
                        <a href="#" className="hover:underline">
                            Privacy
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-2xl border p-4">
            <div className="text-sm font-medium text-muted-foreground">
                {label}
            </div>
            <div className="mt-2 text-3xl font-bold">{value}</div>
        </div>
    );
}

function StepCard({
    icon,
    title,
    text,
}: {
    icon: string;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-2xl border p-4">
            <div className="flex items-center gap-2 text-base font-semibold">
                <span className="grid h-8 w-8 place-items-center rounded-full border">
                    {icon}
                </span>
                {title}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        </div>
    );
}
