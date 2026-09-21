const getStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const setStorage = (key, data) => {
  localStorage.setItem(
    key,
    JSON.stringify(data)
  );
};

// =========================
// WATCHLIST
// =========================

export function getWatchlist() {
  return getStorage('sceneit-watchlist');
}

export function saveWatchlist(data) {
  setStorage('sceneit-watchlist', data);
}

// =========================
// WATCHED
// =========================

export function getWatched() {
  return getStorage('sceneit-watched');
}

export function saveWatched(data) {
  setStorage('sceneit-watched', data);
}

// =========================
// FAVORITE
// =========================

export function getFavorites() {
  return getStorage('sceneit-favorite');
}

export function saveFavorites(data) {
  setStorage('sceneit-favorite', data);
}

// =========================
// REVIEWS
// =========================

export function getReviews() {
  return getStorage('sceneit-reviews');
}

export function saveReviews(data) {
  setStorage('sceneit-reviews', data);
}