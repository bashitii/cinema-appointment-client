/**
 * Convert DB status (snake_case) to display text.
 * now_showing → Now Showing
 */
export function formatStatus(s) {
  if (!s) return "";
  return s.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/**
 * Convert duration to readable string.
 * 166 → "2h 46m"  |  "2h 46m" → "2h 46m"
 */
export function formatDuration(d) {
  if (!d) return "";
  const n = parseInt(d);
  if (isNaN(n)) return d; // already formatted
  const h = Math.floor(n / 60);
  const m = n % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/**
 * Format ISO timestamp to "5:30 PM"
 */
export function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Format ISO timestamp to "Wed, Sep 3 · 5:30 PM"
 */
export function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}

/**
 * Map TMDB genre ID to name.
 */
export const TMDB_GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 18: "Drama", 14: "Fantasy", 27: "Horror",
  10749: "Romance", 878: "Sci-Fi", 53: "Thriller", 37: "Western",
  10751: "Family", 9648: "Mystery", 36: "History",
};
