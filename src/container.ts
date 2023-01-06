import 'reflect-metadata'

import { ContainerBuilder } from 'diod'
import Engine from './engine'
import { EventBus } from './engine/Events/bus'
import Logger from './engine/core/logger'

const builder = new ContainerBuilder()

builder.registerAndUse(Logger)
builder.registerAndUse(EventBus)
builder.registerAndUse(Engine)

const container = builder.build()

export default container
