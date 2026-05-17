// Detect base path dynamically
export function getBasePath() {
  const { origin, pathname } = window.location;

  // If running on GitHub Pages project repo
  if (origin.includes("github.io")) {
    const repo = pathname.split("/")[1];
    return `/${repo}`;
  }
  // Localhost or custom domain
  return "";
}
