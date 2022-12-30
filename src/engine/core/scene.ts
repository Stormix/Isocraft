import { Container } from '@pixi/display'
import { Process } from '../interfaces/process'

export abstract class Scene extends Container implements Process {
  constructor() {
    super()
    this.visible = false
  }
  start() {
    this.visible = true
  }
  stop() {
    this.visible = false
  }

  update(deltaTime: number) {}
}
