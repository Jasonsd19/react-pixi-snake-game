import { Sprite, useTick } from "@inlet/react-pixi"
import fruitImg from "/assets/fruit.png"
import * as c from "../constants"
import getRandomCoords from "../helpers/getRandomCoords"

interface FruitProps {
    imageDim: number
    fruitPos: number
    setFruitPos: React.Dispatch<React.SetStateAction<number>>
    snakePos: number[]
    score: number
    setScore: React.Dispatch<React.SetStateAction<number>>
}

const Fruit = ({
    imageDim,
    fruitPos,
    setFruitPos,
    snakePos,
    score,
    setScore
}: FruitProps) => {

    // Checks if the fruit is eaten every game tick
    useTick(() => {
        if (snakePos[0] === fruitPos) {
            setFruitPos(getRandomCoords(snakePos))
            setScore(score + 1)
        }
    })

    return (
        <Sprite
            image={fruitImg}
            height={imageDim}
            width={imageDim}
            x={(fruitPos % c.CELLS) * imageDim + imageDim / 2}
            y={Math.floor(fruitPos / c.CELLS) * imageDim + imageDim / 2}
            anchor={0.5}
            zIndex={1}
        />
    )
}

export default Fruit