import { Graphics } from '@pixi/graphics'
import { Subscriber } from '../../Engine/Events/Subscriber'
import { Scene } from '../../engine/core/scene'
import { GameScene } from './GameScene'
import { Events } from '../events'
import Game from '..'

export class LoadingScene extends Scene {
  private _game: Game
  private _progressBarContainer = new Graphics()
  private _progressBar = new Graphics()
  private _bg = new Graphics()
  private _progressBarSize: number
  private _progressBarWidth: number
  private _loadingListeners: Subscriber[]

  constructor(game: Game) {
    super()

    this.name = 'LoadingScene'
    this._game = game
    this._progressBarSize = 0.6 * game.width
    this._progressBarWidth = 0.01 * game.height
    this._loadingListeners = [
      Subscriber.fromTopic(Events.LOADING_PROGRESS, (event) => {
        this.updateProgress(event.data)
      }),
      Subscriber.fromTopic(Events.LOADING_COMPLETE, () => {
        this._game.switchScene(new GameScene(this._game))
      })
    ]

    for (const listener of this._loadingListeners) {
      this._game.engine.eventBus.subscribe(listener)
    }
  }

  private updateProgress(value: number) {
    this.drawProgressBar(value)
  }

  private drawProgressBar(value: number) {
    this._progressBar.clear()
    this._progressBar.beginFill(0xffffff)
    this._progressBar.drawRect(0, 0, this._progressBarSize * (value / 100), this._progressBarWidth)
    this._progressBar.endFill()
  }

  private drawProgressContainer() {
    this._progressBarContainer = new Graphics()
    this._progressBarContainer.lineStyle(4, 0xffffff)
    const spacing = 15
    this._progressBarContainer.drawRect(
      this._progressBar.x - spacing / 2,
      this._progressBar.y - spacing / 2,
      this._progressBarSize + spacing,
      this._progressBarWidth + spacing
    )
    this._progressBarContainer.endFill()
    return this._progressBarContainer
  }

  private drawBackground() {
    this._bg = new Graphics()
    this._bg.beginFill(0x000000)
    this._bg.drawRect(0, 0, this._game.width, this._game.height)
    this._bg.endFill()
    return this._bg
  }

  public start(): void {
    super.start()
    this._progressBar = new Graphics()
    this._progressBar.beginFill(0xffffff)
    this._progressBar.drawRect(0, 0, 100, 10)
    this._progressBar.endFill()

    this._progressBar.x = this._game.width / 2 - this._progressBarSize / 2
    this._progressBar.y = this._game.height / 2 - this._progressBarWidth / 2

    this.addChild(this.drawBackground())
    this.addChild(this.drawProgressContainer())
    this.addChild(this._progressBar)
  }

  public stop(): void {
    super.stop()
  }
}
