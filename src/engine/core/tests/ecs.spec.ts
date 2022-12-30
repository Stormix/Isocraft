import { Component } from '../../interfaces'
import { Entity } from '../entity'

class E extends Entity {}

class C1 implements Component {
  public Entity: E | null = null
  public update(_deltaTime: number): void {
    /*...*/
  }
}
class C2 implements Component {
  public Entity: E | null = null
  public update(_deltaTime: number): void {
    /*...*/
  }
}
class C3 implements Component {
  public Entity: E | null = null
  public update(_deltaTime: number): void {
    /*...*/
  }
}

describe('ECS ->', () => {
  let e: E
  const c1 = new C1()
  const c2 = new C2()
  const c3 = new C3()

  beforeEach(() => {
    e = new E()
  })

  it('should add, remove, get, and check components', () => {
    // --- ADD --- //
    expect(e.Components.length).toBe(0)
    e.addComponent(c1)
    e.addComponent(c2)
    e.addComponent(c3)

    expect(e.Components.length).toBe(3)
    expect(e.Components[0]).toBe(c1)
    expect(e.Components[1]).toBe(c2)
    expect(e.Components[2]).toBe(c3)

    e.removeComponent(C2)
    expect(e.Components.length).toBe(2)
    expect(e.Components[0]).toBe(c1)
    expect(e.Components[1]).toBe(c3)

    expect(e.GetComponent(C1)).toBe(c1)
    expect(e.GetComponent(C3)).toBe(c3)

    expect(e.hasComponent(C1)).toBeTruthy()
    expect(e.hasComponent(C3)).toBeTruthy()
  })

  it("should throw error if component wasn't found", () => {
    expect(e.hasComponent(C1)).toBeFalsy()
    expect(() => e.GetComponent(C1)).toThrow()
  })

  it('should update all Components', () => {
    const spy1 = jest.spyOn(c1, 'update')
    const spy2 = jest.spyOn(c2, 'update')
    const spy3 = jest.spyOn(c3, 'update')

    expect(spy1).not.toBeCalled()
    expect(spy2).not.toBeCalled()
    expect(spy3).not.toBeCalled()

    e.addComponent(c1)
    e.addComponent(c2)
    e.addComponent(c3)

    const deltaTime = 12
    e.update(deltaTime)

    expect(spy1).toBeCalledWith(deltaTime)
    expect(spy2).toBeCalledWith(deltaTime)
    expect(spy3).toBeCalledWith(deltaTime)
  })
})
