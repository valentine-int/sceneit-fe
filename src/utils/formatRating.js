export function formatRating(rating) {
  if (rating === null || rating === undefined) {
    return '-';
  }

  return Number(rating).toFixed(1);
}