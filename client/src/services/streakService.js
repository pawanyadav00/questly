// streakService.js – helper utilities for daily streak tracking

/**
 * Increment the player's streak by 1 day.
 * The actual streak state lives in PlayerContext; this function
 * simply returns the new streak value based on the previous one.
 */
export const incrementStreak = (currentStreak) => currentStreak + 1;

/**
 * Reset the streak to 1 (for the current day).
 */
export const resetStreak = () => 1;

/**
 * Helper to compute the longest streak so far.
 */
export const computeLongestStreak = (currentStreak, longestStreak) =>
  Math.max(currentStreak, longestStreak);
