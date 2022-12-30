import 'reflect-metadata'

import container from './container'
import Engine from './engine'
import Game from './game'

import './style.scss'

const canvas = document.getElementById('viewport') as HTMLCanvasElement
const gameArea = document.getElementById('gameArea') as HTMLElement
const engine = container.get(Engine)
const game = new Game(engine)

window.onload = () => {
  engine.init(canvas, gameArea, 800, 600)
  engine.start(game)
}
