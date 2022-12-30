import { Component } from '../interfaces'
import { Update } from '../interfaces/update'
import { constr } from '../utils/types'

export abstract class Entity implements Update {
  protected _components: Component[] = []

  public get Components(): Component[] {
    return this._components
  }

  public addComponent(component: Component): void {
    this._components.push(component)
    component.Entity = this
  }

  public GetComponent<C extends Component>(constr: constr<C>): C {
    for (const component of this._components) {
      if (component instanceof constr) {
        return component as C
      }
    }
    throw new Error(`Component ${constr.name} not found on Entity ${this.constructor.name}`)
  }

  public removeComponent<C extends Component>(constr: constr<C>): void {
    let toRemove: Component | undefined
    let index: number | undefined

    for (let i = 0; i < this._components.length; i++) {
      const component = this._components[i]
      if (component instanceof constr) {
        toRemove = component
        index = i
        break
      }
    }

    if (toRemove && index) {
      toRemove.Entity = null
      this._components.splice(index, 1)
    }
  }

  public hasComponent<C extends Component>(constr: constr<C>): boolean {
    for (const component of this._components) {
      if (component instanceof constr) {
        return true
      }
    }

    return false
  }

  update(deltaTime: number): void {
    for (const component of this._components) {
      component.update(deltaTime)
    }
  }
}
