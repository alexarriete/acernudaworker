export function getFirstSlice(request) {
  const url = new URL(request.url);
  const pathSegments = url.pathname
    .split('/')
    .filter(segment => segment.length > 0);

  return pathSegments.length > 0 ? pathSegments[0] : "";
}
