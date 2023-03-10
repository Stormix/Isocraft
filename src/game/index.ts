import { Service } from 'diod'
import { World } from 'miniplex'
import { SCALE_MODES, Spritesheet } from 'pixi.js'
import Engine from '../engine'
import { IEntity } from '../engine/core/entity'
import { Renderer } from '../engine/core/renderer'
import { Scene } from '../engine/core/scene'
import { Event } from '../engine/events/Event'
import { Process } from '../engine/interfaces/process'
import { Events } from './events'
import { LoadingScene } from './scenes/LoadingScene'

@Service()
export default class Game implements Process {
  private _scene?: Scene
  private _loadingProgress = 0
  private _assets: string[] = ['sprites/blocks/blocks.json']
  private _spritesheets: Spritesheet[] = []
  private _world: World

  get scene(): Scene {
    return this._scene as Scene // There's always a scene at this point
  }

  get renderer(): Renderer {
    return this._engine.renderer
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

  get spritesheets(): Spritesheet[] {
    return this._spritesheets
  }

  constructor(private _engine: Engine) {
    this._scene = new LoadingScene(this)
    this._world = new World<IEntity>()
  }

  get world(): World<IEntity> {
    return this._world
  }

  load(): void {
    this.logger.info('Game loading...')
    this._scene?.start()

    this._engine.loader.onError.add(() => this.logger.error('Error loading resources.'))
    this._engine.loader.onProgress.add((loader) => {
      this.loadingProgress = loader.progress
    })

    this._engine.loader.onComplete.add((_, resources) => {
      this.logger.info('Resources loaded.', resources)

      for (const key in resources) {
        if (resources[key].spritesheet) {
          resources[key].spritesheet!.baseTexture.scaleMode = SCALE_MODES.NEAREST
          this._spritesheets.push(resources[key].spritesheet as Spritesheet)
        }
      }

      this._engine.eventBus.publish(new Event(Events.LOADING_COMPLETE, null))
    })

    this.logger.info('World created.')
    this._engine.loader.add(this._assets).load()
  }

  start(): void {
    this.logger.info('Game started.')
  }

  stop(): void {
    this.logger.info('Game ended.')
    delete this._scene
  }

  update(delta: number): void {
    if (this._scene) this._scene.update(delta)
  }

  render(renderer: Renderer) {
    if (this._scene) renderer.render(this._scene)
  }

  switchScene(scene: Scene) {
    this.logger.info('Switching scene, from ' + this._scene?.name + ' to ' + scene.name + '.')
    this._scene?.stop()
    this._scene = scene
    this._scene.start()
  }
}
