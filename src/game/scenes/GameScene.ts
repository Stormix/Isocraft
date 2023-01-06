import { Vector3 } from '@math.gl/core'
import { IsoTilemap, MIDDLE } from 'iceoh'
import { Viewport } from 'pixi-viewport'
import Game from '..'
import { SPRITE_SIZE, WORLD_SIZE } from '../../engine/config/constants'
import { IEntity } from '../../engine/core/entity'
import { Scene } from '../../engine/core/scene'
import { Block } from '../entities/block'

export class GameScene extends Scene {
  private readonly _game: Game
  private _viewport: Viewport
  private _map: IsoTilemap<IEntity>

  get game(): Game {
    return this._game
  }

  get map(): IsoTilemap<IEntity> {
    return this._map
  }

  constructor(game: Game) {
    super()

    this.name = 'GameScene'
    this._game = game
    this.visible = false

    // create viewport
    this._viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: WORLD_SIZE,
      worldHeight: WORLD_SIZE
    })

    this._map = new IsoTilemap<IEntity>({
      getGlobalDimensions: () => this._game.engine.viewport.getBoundingClientRect(),
      getWorldPosition: () => this._viewport.position,
      getWorldScale: () => ({ x: this._viewport.scale.x * 10, y: this._viewport.scale.y * 10 }),
      worldOrigin: MIDDLE,
      baseTileDimensions: {
        width: SPRITE_SIZE - 1, // -1 to prevent seams between tiles
        height: SPRITE_SIZE,
        depth: SPRITE_SIZE / 2 // how many pixels tall is the front edge of the tile
      }
    })

    this.addChild(this._viewport)

    // Activate plugins
    this._viewport.drag().pinch().wheel().decelerate()
  }

  public start(): void {
    super.start()

    // Draw an 8 x 8 plane of blocks
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        this.addEntity(new Block(this, new Vector3(x, y, 0)))
      }
    }
  }

  public stop(): void {
    super.stop()
  }

  addEntity(entity: IEntity) {
    // Add entity to the world (ECS)
    this._game.world.add(entity)

    // Register sprite component
    if (entity.sprite) {
      this._viewport.addChild(entity.sprite)
    }
  }

  public update(_deltaTime: number): void {}
}
