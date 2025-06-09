export function toImageKitUrl(
    s3Url: string,
    transform = "f-auto,q-auto"
  ): string {
    const IMAGEKIT_BASE = process.env.NEXT_PUBLIC_IMAGEKIT_BASE_URL!;
    const { pathname } = new URL(s3Url);
    const keyPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
    return `${IMAGEKIT_BASE}/${keyPath}?tr=${transform}`;
  }