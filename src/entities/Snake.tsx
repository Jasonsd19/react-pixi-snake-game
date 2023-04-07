import { Sprite, useTick } from "@inlet/react-pixi"
import snakeHead from "/assets/snakeHead.png"
import snakeBody from "/assets/snakeBody.png"
import snakeEnd from "/assets/snakeEnd.png"
import { useEffect, useRef } from "react"
import * as c from "../constants"
import getNewDirection from "../helpers/getNewDirection"
import getNewPosition from "../helpers/getNewPosition"

interface SnakeProps {
    imageDim: number
    snakePos: number[]
    setSnakePos: React.Dispatch<React.SetStateAction<number[]>>
    directions: React.MutableRefObject<number[]>
    gameTicks: React.MutableRefObject<number>
    paused: boolean
    collideWalls: boolean
    endGame: () => void
}

const Snake = ({
    imageDim,
    snakePos,
    setSnakePos,
    directions,
    gameTicks,
    paused,
    collideWalls,
    endGame
}: SnakeProps) => {
    const count = useRef(0)

    // Handles changing the snake's direction
    useEffect(() => {
        const keyDown = (e: KeyboardEvent) => {
            if (!paused) {
                const newDirection = getNewDirection(e.code, directions.current[0])

                // Our new direction is the opposite of our current direction if the absolute
                // difference b/w them is 2. If it is, we don't change direction.
                if (Math.abs(directions.current[0] - newDirection) === 2) return

                // We check to see if the direction is opposite of the direction of the snake's body.
                // This check is so the player doesn't move twice within one game tick and run into their own body.
                if (directions.current.length > 1 && Math.abs(directions.current[1] - newDirection) == 2) return

                directions.current[0] = newDirection
            }
        }

        window.addEventListener("keydown", keyDown)

        return () => {
            window.removeEventListener("keydown", keyDown)
        }
    }, [paused])

    // Handles resetting the game when we lose.
    const lostGame = () => {
        count.current = 0
        endGame()
    }

    // Updates the snake's position every game tick
    useTick(() => {
        if (count.current % gameTicks.current === 0) {
            // Used the set the position and direction of the next snake body part.
            // Ensures they accurately follow eachother.
            let lastPos = 0
            let lastDirec = 0

            for (let index = 0; index < snakePos?.length; index++) {
                if (index === 0) {
                    // Handle the logic for snake head
                    lastPos = snakePos[index]
                    lastDirec = directions.current[index]

                    const [newPos, x, y] = getNewPosition(directions.current[index], snakePos[index], collideWalls, false)

                    // Check if we're out of bounds
                    if (collideWalls && ((x > c.CELLS - 1 || x < 0) || (y > c.CELLS - 1 || y < 0))) {
                        lostGame()
                        return
                    }

                    // Check if we collided with the snake body
                    for (let j = 3; j < snakePos?.length; j++) {
                        if (newPos === snakePos[j]) {
                            lostGame()
                            return
                        }
                    }

                    snakePos[index] = newPos
                    setSnakePos([...snakePos])

                } else {
                    // Handle logic for snake body
                    const newPos = lastPos
                    const newDirec = lastDirec

                    lastPos = snakePos[index]
                    lastDirec = directions.current[index]

                    snakePos[index] = newPos
                    directions.current[index] = newDirec
                    setSnakePos([...snakePos])
                }
            }
        }
        count.current += 1
    })

    return (
        <>
            {snakePos?.length &&
                snakePos.map((pos, i) => {
                    let img = snakeBody
                    if (i === snakePos.length - 1) img = snakeEnd
                    if (i === 0) img = snakeHead
                    return (
                        <Sprite
                            image={img}
                            height={imageDim}
                            width={imageDim}
                            x={(pos % c.CELLS) * imageDim + imageDim / 2}
                            y={Math.floor(pos / c.CELLS) * imageDim + imageDim / 2}
                            anchor={0.5}
                            key={i}
                            rotation={Math.PI / 2 * directions.current[i]}
                            zIndex={5}
                        />
                    )
                })
            }
        </>
    )
}

export default Snake