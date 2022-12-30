import Engine from '../engine'
import { Scene } from '../engine/core/scene'
import { Event } from '../engine/events/Event'
import { Process } from '../engine/interfaces/process'
import { Events } from './events'
import { Service } from 'diod'
import { Renderer } from '../engine/core/renderer'
import { LoadingScene } from './scenes/LoadingScene'

@Service()
export default class Game implements Process {
  private _scene?: Scene
  private _loadingProgress = 0
  private _assets: string[] = []

  get scene(): Scene {
    return this._scene as Scene // There's always a scene at this point
  }

  get engine(): Engine {
    return this._engine
  }

  get width(): number {
    return this._engine.width
  }

  get height(): number {
    return this._engine.height
  }

  get loadingProgress(): number {
    return this._loadingProgress
  }

  set loadingProgress(value: number) {
    this._loadingProgress = value
    this._engine.eventBus.publish(new Event(Events.LOADING_PROGRESS, value))
  }

  get logger() {
    return this._engine.logger
  }

  public onResize() {
    // Resize scene?
  }

  constructor(private _engine: Engine) {
    this.logger.debug('Game created.')
    this._scene = new LoadingScene(this)
    this.logger.debug('Game is loading...')
  }

  load(): void {
    this.logger.debug('Game loading...')
    this._scene?.start()

    this._engine.loader.onError.add(() => this.logger.error('Error loading resources.'))
    this._engine.loader.onProgress.add((loader) => {
      this.loadingProgress = loader.progress
    })

    this._engine.loader.onComplete.add(() => {
      this._engine.eventBus.publish(new Event(Events.LOADING_COMPLETE, null))
    })

    this._engine.loader.add(this._assets).load()
  }

  start(): void {
    this.logger.debug('Game started.')
  }

  stop(): void {
    this.logger.debug('Game ended.')
    delete this._scene
  }

  update(delta: number): void {
    if (this._scene) this._scene.update(delta)
  }

  render(_renderer: Renderer) {
    if (this._scene) _renderer.render(this._scene)
  }

  switchScene(scene: Scene) {
    this.logger.debug('Switching scene, from ' + this._scene?.name + ' to ' + scene.name + '.')
    this._scene?.stop()
    this._scene = scene
    this._scene.start()
  }
}
