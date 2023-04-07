import './App.css'
import { Container, Stage, Text } from "@inlet/react-pixi"
import * as c from "./constants"
import Snake from './entities/Snake'
import * as PIXI from 'pixi.js';
import Fruit from './entities/Fruit';
import { useCallback, useEffect, useRef, useState } from 'react';
import getRandomCoords from './helpers/getRandomCoords';
import getNewPosition from './helpers/getNewPosition';
import getScreenDimensions from './helpers/getScreenDimensions';

function App() {

  // Ref to pixi js application
  const application = useRef<PIXI.Application | null>(null)

  // Screen size
  const [screenDim, setScreenDim] = useState<number>(getScreenDimensions())

  // Image dimensions
  const [imageDim, setImageDim] = useState<number>(0)

  // Determines the speed of the snake
  const gameTicks = useRef(c.GAME_TICKS)

  // Handles pausing/starting the game
  const [paused, setPaused] = useState(true)

  // Whether we collide with walls or not
  const [collideWalls, setCollideWalls] = useState(true)

  // Snake direction -> 0: South, 1: West, 2: North, 3: East
  const directions = useRef<number[]>([0])
  const [score, setScore] = useState(0)

  // Snake head and body positions
  const [snakePos, setSnakePos] = useState<number[]>([Math.floor(c.CELLS * ((c.CELLS / 2) + 1))])

  // Fruit position
  const [fruitPos, setFruitPos] = useState<number>(getRandomCoords(snakePos))

  // Update the image dimensions whenever our screen dimensions change
  useEffect(() => {
    const newImageDim = screenDim / c.CELLS
    setImageDim(newImageDim)
  }, [screenDim])

  // Handles screen resize listener
  useEffect(() => {
    const changeStageSize = () => {
      const dim = getScreenDimensions()
      setScreenDim(dim)
    }

    window.addEventListener("resize", changeStageSize)
    return () => {
      window.removeEventListener("resize", changeStageSize)
    }
  }, [screenDim])

  // The next two useEffects handle the pause/resume functionality
  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setPaused(!paused)
      }
    }

    window.addEventListener("keydown", keyDown)
    return () => {
      window.removeEventListener("keydown", keyDown)
    }
  }, [paused])

  useEffect(() => {
    setTimeout(() => {
      paused ? application.current?.stop() : application.current?.start()
    }, 20);
  }, [paused])

  // Handles adding new snake body after eating fruit, and manages game speed
  useEffect(() => {
    if (score > 0) {
      const [newPos] = getNewPosition(directions.current[score - 1], snakePos[score - 1], collideWalls, true)
      snakePos.push(newPos)
      directions.current.push(directions.current[score - 1])
    }

    if (score > 0 && score <= 60 && score % 20 === 0) gameTicks.current -= c.GAME_SPEED_INCREASE
  }, [score])

  // Store the reference to application in our useRef
  const onMount = (app: PIXI.Application) => {
    application.current = app
  }

  // Clean-up and reset game state
  const endGame = () => {
    directions.current = [0]
    gameTicks.current = c.GAME_TICKS
    setScore(0)
    setSnakePos([Math.floor(c.CELLS * ((c.CELLS / 2) + 1))])
    setFruitPos(getRandomCoords([Math.floor(c.CELLS * c.CELLS / 2)]))
    setPaused(true)
    application.current?.stop()
    application.current?.resize()
  }

  const getSpeedDescription = () => {
    if (score >= 0 && score < 20) return "Normal Speed"
    if (score >= 20 && score < 40) return "Fast Speed"
    if (score >= 40 && score < 60) return "Super-Sonic Speed"
    if (score >= 60) return "BARRY ALLEN"
  }

  // Styling for the pause menu text
  const textStyle = new PIXI.TextStyle({
    fontSize: screenDim / 20 || 26,
    fill: "#ffffff",
    fontFamily: "Times New Roman",
    strokeThickness: 3
  });

  return (
    <div className='mainContainer'>
      <div className="gameContainer">
        <div className='header'>
          <div>
            Collide with walls:
            <input type='checkbox' onChange={() => setCollideWalls(!collideWalls)} checked={collideWalls} />
          </div>
          <div>
            {`Your current score is: ${score}`}
          </div>
          <div>
            {getSpeedDescription()}
          </div>
        </div>
        <Stage width={screenDim} height={screenDim} onMount={onMount} raf={false}>
          <Container sortableChildren={true}>
            {paused && (
              <Text zIndex={10} text="Use space bar to start or pause the game!" x={screenDim / 2} y={screenDim / 2} anchor={0.5} style={textStyle} />
            )}
            <Snake imageDim={imageDim} snakePos={snakePos} setSnakePos={setSnakePos} directions={directions} gameTicks={gameTicks} paused={paused} collideWalls={collideWalls} endGame={endGame} />
            <Fruit imageDim={imageDim} fruitPos={fruitPos} setFruitPos={setFruitPos} snakePos={snakePos} score={score} setScore={setScore} />
          </Container>
        </Stage >
      </div>
    </div>
  )
}

export default App