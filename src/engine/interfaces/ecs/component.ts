import { Entity } from '../../core/entity'
import { Update } from '../update'

export interface Component extends Update {
  Entity: Entity | null //
}
