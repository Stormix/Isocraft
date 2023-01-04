import { Viewport } from 'pixi-viewport'
import Game from '..'
import { Entity } from '../../engine/core/entity'
import { Scene } from '../../engine/core/scene'
import { Block } from '../entities/block'

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

    this.addEntity(new Block(this._game))
  }

  public stop(): void {
    super.stop()
  }

  addEntity(entity: Entity) {
    // Add entity to the world (ECS)
    this._game.world.add(entity)

    // Register sprite component
    if (entity.sprite) {
      this._viewport.addChild(entity.sprite)
    }
  }

  public update(_deltaTime: number): void {}
}
