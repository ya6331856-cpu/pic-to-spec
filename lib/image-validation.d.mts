export function validateImageFile(type: string, size: number): string | null;
export function validateImageDimensions(width: number, height: number, max?: number): boolean;
export function validateCropBounds(x: number, y: number, width: number, height: number, imageWidth: number, imageHeight: number): boolean;
