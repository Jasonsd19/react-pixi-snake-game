import { Random } from "random-js"
import * as c from "../constants"

/**
 * Takes in the current position of each segment of the snake. Then returns
 * a random empty grid coordinate. Used to find a new spawn coordinate for
 * the fruit.
 * 
 * @param snakePos the current positions of the snake's body
 * @returns A random empty coordinate on the grid.
 */
const getRandomCoords = (snakePos: number[]) => {
    const validCells: number[] = []
    for (let i = 0; i < c.CELLS * c.CELLS; i++) {
      if (snakePos.includes(i)) continue
      validCells.push(i)
    }
  
    return (new Random().pick(validCells))
  }

  export default getRandomCoords