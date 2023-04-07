import * as c from "../constants"

/**
 * This function take the current browser window dimension and returns the correct
 * valid screen size. The x and y dimensions for the screen and all rendered images
 * will always be the same b/c we only use squares, as to simplify the ratio between
 * dimensions. This informs and simplifies a lot of our math.
 * 
 * @returns The new dimensions for our game screen
 */
const getScreenDimensions = () => {
    const minDim = Math.min(window.innerWidth, window.innerHeight)
    for (const dimension of c.VALID_DIMENSIONS) {
        if (minDim > dimension) return dimension
    }

    const smallestDim = c.VALID_DIMENSIONS[c.VALID_DIMENSIONS.length - 1]
    return smallestDim
}

export default getScreenDimensions