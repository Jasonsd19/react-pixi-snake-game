import * as c from "../constants"

/**
 * Takes in the current direction and position and returns three numbers. The
 * first is the newPosition of the snake, and the second is the new x-grid value.
 * The new x-grid value is used to check if the snake is out of bounds. Also takes in two
 * booleans, each of which changes the calculation.
 * 
 * @param direction the snake's current direction
 * @param currentPos the snake's current position
 * @param collideWalls boolean to determine whether we collide with walls or not, modifies calculation
 * @param newBody boolean to determine which type of calculation to use, new and existing segments are calculated differently
 * @returns Three numbers. First is the new position and second is the new x-grid value, and third is the new y-grid value
 */
const getNewPosition = (direction: number, currentPos: number, collideWalls: boolean, newSegment: boolean) => {
    let x = currentPos % c.CELLS
    let y = Math.floor(currentPos / c.CELLS)
    switch (direction) {
        case 0:
            newSegment ? y -= 1 : y += 1
            break;
        case 1:
            newSegment ? x += 1 : x -= 1
            break;
        case 2:
            newSegment ? y += 1 : y -= 1
            break;
        default:
            newSegment ? x -= 1 : x += 1
            break;
    }

    // Wrap around the floor and ceiling
    if (!newSegment && !collideWalls && y > c.CELLS - 1) y = 0
    if (!newSegment && !collideWalls && y < 0) y = c.CELLS - 1

    // Wrap around the walls
    if (!newSegment && !collideWalls && x > c.CELLS - 1) x = 0
    if (!newSegment && !collideWalls && x < 0) x = c.CELLS - 1

    return [y * c.CELLS + x, x, y]
}

export default getNewPosition