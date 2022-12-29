import 'reflect-metadata'
import Engine from './engine'
import './style.scss'

const canvas = document.getElementById('viewport') as HTMLCanvasElement
const gameArea = document.getElementById('gameArea') as HTMLElement
const engine = new Engine(canvas, gameArea, 800, 600)

window.onload = () => {
  engine.start()
}
