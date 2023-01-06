import { Vector3 } from '@math.gl/core'
import { Sprite } from 'pixi.js'

export interface Entity {
  sprite: Sprite
  worldPosition: Vector3
  screenPosition: Vector3
  width: number
  height: number
}
