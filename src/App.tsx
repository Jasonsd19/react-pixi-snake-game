import './App.css'
import { Container, Stage, Text } from "@inlet/react-pixi"
import * as c from "./constants"
import Snake from './entities/Snake'
import * as PIXI from 'pixi.js';
import Fruit from './entities/Fruit';
import { useEffect, useRef, useState } from 'react';
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

  //Handles displaying the game over screen
  const [gameOver, setGameOver] = useState(false)

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
        gameOver ? resetGame() : setPaused(!paused)
      }
    }

    window.addEventListener("keydown", keyDown)
    return () => {
      window.removeEventListener("keydown", keyDown)
    }
  }, [paused, gameOver])

  useEffect(() => {
    setTimeout(() => {
      paused ? application.current?.stop() : application.current?.start()
    }, 20);
  }, [paused])

  // Handles updating high score in local storage
  useEffect(() => {
    const highScore = parseInt(localStorage.getItem("highScore") ?? '0')
    if (score >= highScore) localStorage.setItem("highScore", score.toString())
  }, [gameOver])

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
  const resetGame = () => {
    directions.current = [0]
    gameTicks.current = c.GAME_TICKS
    setScore(0)
    setSnakePos([Math.floor(c.CELLS * ((c.CELLS / 2) + 1))])
    setFruitPos(getRandomCoords([Math.floor(c.CELLS * c.CELLS / 2)]))
    setGameOver(false)
    setPaused(false)
    application.current?.start()
  }

  const getSpeedDescription = () => {
    if (score >= 0 && score < 20) return "Normal Speed"
    if (score >= 20 && score < 40) return "Fast Speed"
    if (score >= 40 && score < 60) return "Super-Sonic Speed"
    if (score >= 60) return "BARRY ALLEN"
  }

  // Styling for the pause menu text
  const textStyle = new PIXI.TextStyle({
    fontSize: screenDim / 50 || 20,
    fill: "#ffffff",
    fontFamily: "Press Start 2P",
    strokeThickness: 3
  });

  const gameOverText = `Game over, you ended with a score of: ${score}\n       Your highest score was ${parseInt(localStorage.getItem("highScore") ?? '0')}.\n     Press space bar to play again!`

  return (
    <div className="gameContainer">
      <div className='header'>
        <div className='checkbox'>
          {"Collide with walls: "}
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
            gameOver
              ? <Text zIndex={10} text={gameOverText} x={screenDim / 2} y={screenDim / 2} anchor={0.5} style={textStyle} />
              : <Text zIndex={10} text="Use space bar to start or pause the game!" x={screenDim / 2} y={screenDim / 2} anchor={0.5} style={textStyle} />
          )}
          <Snake imageDim={imageDim} snakePos={snakePos} setSnakePos={setSnakePos} directions={directions} gameTicks={gameTicks} paused={paused} collideWalls={collideWalls} setPaused={setPaused} setGameOver={setGameOver} />
          <Fruit imageDim={imageDim} fruitPos={fruitPos} setFruitPos={setFruitPos} snakePos={snakePos} score={score} setScore={setScore} />
        </Container>
      </Stage >
    </div>
  )
}

export default App