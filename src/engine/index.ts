import { Service } from 'diod'
import * as PIXI from 'pixi.js'
import Stats from 'stats.js'
import Game from '../game'
import { DEBUG_MODE } from './config/constants'
import Logger from './core/logger'
import { Renderer } from './core/renderer'
import { EventBus } from './Events/bus'
import { calculateAspectRatio } from './utils/general'

declare global {
  interface Window {
    __PIXI_INSPECTOR_GLOBAL_HOOK__: any
  }
}

@Service()
export default class Engine {
  private _gameArea!: HTMLElement
  private _viewport!: HTMLCanvasElement
  private _width!: number
  private _height!: number
  private _stats: Stats | undefined
  private _gameTime = 0
  private _elapsed = 0
  private _aspect = 1
  private _renderer!: Renderer
  private _game!: Game
  private _loader!: PIXI.Loader

  constructor(public readonly logger: Logger, public readonly eventBus: EventBus) {}

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  get viewport() {
    return this._viewport
  }

  get gameArea() {
    return this._gameArea
  }

  get loader() {
    return this._loader
  }

  private onResize() {
    this.logger.info('Window resized')

    let width = window.innerWidth
    let height = window.innerHeight

    const windowAspectRatio = calculateAspectRatio(width, height)

    if (windowAspectRatio >= this._aspect) {
      width = height * this._aspect
    } else {
      height = width / this._aspect
    }

    this._gameArea.style.width = width + 'px'
    this._gameArea.style.height = height + 'px'

    this._gameArea.style.marginTop = -height / 2 + 'px'
    this._gameArea.style.marginLeft = -width / 2 + 'px'

    this._renderer.resize(width, height)

    this._width = width
    this._height = height
  }

  private measureTime(newTime: number) {
    const lastTime = this._gameTime
    this._gameTime = newTime
    const deltaTime = (this._gameTime - lastTime) / 1000
    this._elapsed += deltaTime
    return deltaTime
  }

  public init(canvas: HTMLCanvasElement, gameArea: HTMLElement, width: number, height: number) {
    this._viewport = canvas
    this._gameArea = gameArea
    this._width = width
    this._height = height

    // Display stats
    if (DEBUG_MODE) {
      this._stats = new Stats()
      this._stats.showPanel(0)
      document.body.appendChild(this._stats.dom)
      // Pixi Inspector
      if (window?.__PIXI_INSPECTOR_GLOBAL_HOOK__) {
        this.logger.info('Pixi Inspector found, registering...')
        window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })
      }
    }

    this._loader = PIXI.Loader.shared
    this._renderer = new Renderer(this._width, this._height, this._viewport)

    // Set canvas size
    this._viewport.width = this.width
    this._viewport.height = this.height

    // Calculate aspect ratio
    this._aspect = calculateAspectRatio(this.width, this.height)

    // Init window size
    this.onResize()
  }

  private update(deltaTime: number) {
    this._game.update(deltaTime)
  }

  private render() {
    this._game.render(this._renderer)
  }
  private loop(newTime: number) {
    try {
      requestAnimationFrame(this.loop.bind(this))

      // Mesure time
      const deltaTime = this.measureTime(newTime)

      // Update
      if (DEBUG_MODE) this._stats?.begin()
      this.update(deltaTime)
      this.render()
      if (DEBUG_MODE) this._stats?.end()
    } catch (e) {
      this.logger.error(e)
    }
  }

  public start(game: Game): void {
    this.logger.info('Engine started')

    // Start game
    this._game = game

    // Events
    window.addEventListener('resize', () => {
      this.onResize()
      this._game.onResize()
    })

    // Start game
    this._game.load()
    this._game.start()

    // start loop
    this.loop(0)
  }
}
