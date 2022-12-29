import { Inject, Service } from 'typedi'
import Logger from './core/logger'
import Stats from 'stats.js'
import { DEBUG_MODE } from './config/constants'

@Service()
class Engine {
  private _gameArea: HTMLElement
  private _viewport: HTMLCanvasElement
  private _width: number
  private _height: number
  private _stats: Stats | undefined
  private _gameTime = 0
  private _elapsed = 0

  @Inject()
  private readonly logger!: Logger

  constructor(canvas: HTMLCanvasElement, gameArea: HTMLElement, width: number, height: number) {
    this._viewport = canvas
    this._gameArea = gameArea
    this._width = width
    this._height = height

    if (DEBUG_MODE) this._stats = new Stats()
  }

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

  private update(deltaTime: number) {
    // TODO: Update game logic
  }

  private render() {}

  private loop(newTime: number) {
    try {
      requestAnimationFrame(this.loop.bind(this))

      // Mesure time
      const lastTime = this._gameTime
      this._gameTime = newTime
      const deltaTime = (this._gameTime - lastTime) / 1000
      this._elapsed += deltaTime

      // Update
      if (DEBUG_MODE) this._stats?.begin()
      this.update(deltaTime)
      this.render()
      if (DEBUG_MODE) this._stats?.end()
    } catch (e) {
      this.logger.error(e)
    }
  }

  public start(): void {
    this.logger.info('Engine started')

    // Display stats
    if (DEBUG_MODE && this._stats) {
      this._stats.showPanel(0)
      document.body.appendChild(this._stats.dom)
    }

    // start loop
    this.loop(0)
  }
}

export default Engine
