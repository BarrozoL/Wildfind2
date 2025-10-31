export async function getJSON<T>(
    url: string,
    signal?: AbortSignal,
): Promise<T> {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
    return res.json() as Promise<T>;
}
