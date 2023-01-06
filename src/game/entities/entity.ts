import { IEntity } from '../../engine/core/entity'
import { Sprite } from 'pixi.js'
import { Texture } from '../textures'
import { SPRITE_SIZE } from '../../engine/config/constants'
import { GameScene } from '../scenes/GameScene'
import { Vector3 } from '@math.gl/core'

export class Entity implements IEntity {
  sprite: Sprite
  worldPosition: Vector3
  screenPosition: Vector3
  width = SPRITE_SIZE
  height = SPRITE_SIZE

  constructor(private readonly scene: GameScene, texture: Texture, worldPosition: Vector3 = new Vector3(0, 0, 0)) {
    this.sprite = new Sprite(this.scene.game.spritesheets[0].textures[texture])
    this.worldPosition = worldPosition

    const screenPosition = this.scene.map.add(this, worldPosition)

    this.screenPosition = new Vector3(screenPosition.x, screenPosition.y, screenPosition.z)
    this.sprite.position.set(this.screenPosition.x, this.screenPosition.y)
    this.sprite.zIndex = this.screenPosition.z as number
    this.sprite.width = this.sprite.height = SPRITE_SIZE
    this.sprite.anchor.set(0.5)

    // this.scene.game.logger.info('Block created at world position', worldPosition, 'and screen position', screenPosition)
  }
}
