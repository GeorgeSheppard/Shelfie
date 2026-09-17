// Remembers, per request, the most recent recommendation the user viewed — so the profile
// page's "back to recommendations" link still works even when it's reached by a direct or
// bookmarked URL rather than by clicking through from a recommendation page (where router
// state carries the id instead). Best-effort: localStorage can throw or be unavailable
// (private browsing, blocked storage), and losing this is never worse than not having a
// working back link at all.
const KEY_PREFIX = "shelfie:lastRecommendationId:";

export const rememberLastRecommendationId = (requestId: string, recommendationId: string) => {
  try {
    localStorage.setItem(`${KEY_PREFIX}${requestId}`, recommendationId);
  } catch {
    // Ignore — see note above.
  }
};

export const getLastRecommendationId = (requestId: string): string | null => {
  try {
    return localStorage.getItem(`${KEY_PREFIX}${requestId}`);
  } catch {
    return null;
  }
};
