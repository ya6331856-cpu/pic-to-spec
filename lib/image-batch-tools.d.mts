export function safeBaseName(name: string): string;
export function renamePattern(index: number, total: number, prefix?: string, start?: number, digits?: number): string;
export function readJpegExif(buffer: ArrayBuffer | Uint8Array): { found: boolean; tags: Record<string, string | number> };
export function clampRegion(value: number, max: number): number;
