/**
 * Takes in a keyboard keyCode plus the current direction and returns
 * a new valid direction if applicable, otherwise returns the current
 * direction.
 * 
 * @param keyCode a string specifying the key that was pressed
 * @param currentDirection current direction of the snake
 * @returns A new valid direction, else the current direction
 */
const getNewDirection = (keyCode: string, currentDirection: number) => {
    let newDirection = currentDirection
    switch (keyCode) {
        case "KeyS":
        case "ArrowDown":
            newDirection = 0
            break;
        case "KeyA":
        case "ArrowLeft":
            newDirection = 1
            break;
        case "KeyW":
        case "ArrowUp":
            newDirection = 2
            break;
        case "KeyD":
        case "ArrowRight":
            newDirection = 3
            break;
    }
    return newDirection
}

export default getNewDirection