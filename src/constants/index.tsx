// The x and y dimensions will always be the same (b/c we only render squares), so we need to only
// store one number to define both dimensions.
export const VALID_DIMENSIONS = [1600, 800, 400, 200]

// 25 cells for the above dimensions give us image sizes ranging from 64x64 -> 8x8
export const CELLS = 25

// We render 60 frames per second, the game ticks determines how
// many frames pass between each game update/tick (keep as Int)
export const GAME_TICKS = 5

// How fast the game speed increases (keep as Int)
export const GAME_SPEED_INCREASE = 1