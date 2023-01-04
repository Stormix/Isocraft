import Game from '..'
import { Entity } from '../../engine/core/entity'
import { Sprite } from 'pixi.js'

export class Block implements Entity {
  sprite: Sprite
  constructor(game: Game) {
    this.sprite = new Sprite(game.spritesheets[0].textures['"blocks-2.png"'])
  }
}
