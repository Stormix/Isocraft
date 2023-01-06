import { Texture } from '../textures'
import { GameScene } from '../scenes/GameScene'
import { Vector3 } from '@math.gl/core'
import { Entity } from './entity'

export class Block extends Entity {
  constructor(scene: GameScene, worldPosition: Vector3 = new Vector3(0, 0, 0)) {
    super(scene, Texture.GrassBlock, worldPosition)
  }
}
