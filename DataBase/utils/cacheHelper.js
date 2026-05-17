export async function getCachedImage(imageUrl) {
  const cacheName = "vendra-image-cache-v1";
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(imageUrl);

  if (cachedResponse) {
    const blob = await cachedResponse.blob();
    return URL.createObjectURL(blob);
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Network response was not ok");

    // Cache the original response
    cache.put(imageUrl, response.clone());

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.warn("Cache failed, using original URL", error);
    return imageUrl; // Fallback to raw URL if fetch fails
  }
}
