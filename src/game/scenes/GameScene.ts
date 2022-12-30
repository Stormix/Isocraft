import { Viewport } from 'pixi-viewport'
import Game from '..'
import { Scene } from '../../engine/core/scene'

export class GameScene extends Scene {
  private _game: Game
  private _viewport: Viewport

  constructor(game: Game) {
    super()

    this.name = 'GameScene'
    this._game = game
    this.visible = false

    // create viewport
    this._viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1000,
      worldHeight: 1000
    })

    this.addChild(this._viewport)
    // activate plugins
    this._viewport.drag().pinch().wheel().decelerate()
  }

  public start(): void {
    super.start()
  }

  public stop(): void {
    super.stop()
  }

  public update(_deltaTime: number): void {}
}
