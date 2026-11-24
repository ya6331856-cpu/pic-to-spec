export function findBestImageQuality<T extends { size: number }>(encode: (quality: number) => Promise<T>, byteLimit: number, iterations?: number): Promise<T | null>;
