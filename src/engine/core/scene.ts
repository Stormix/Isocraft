import { Container } from '@pixi/display'
import { Process } from '../interfaces/process'

export abstract class Scene extends Container implements Process {
  constructor() {
    super()
    this.sortableChildren = true
    this.visible = false
  }
  start() {
    this.visible = true
  }
  stop() {
    this.visible = false

    this.children.forEach((child) => {
      this.removeChild(child)
    })
  }

  abstract update(deltaTime: number): void
}
