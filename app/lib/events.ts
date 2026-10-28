export type DomainEvent =
  | { type: 'order:deleted'; orderId: number; title: string; productCount: number }
  | { type: 'product:deleted'; productId: number; title: string; orderId: number }
  | { type: 'order:opened'; orderId: number; title: string }
  | { type: 'filter:changed'; value: string }

export type DomainEventType = DomainEvent['type']

type Handler<E extends DomainEvent = DomainEvent> = (event: E) => void

export class EventBus {
  private handlers = new Map<DomainEventType | '*', Set<Handler>>()

  on<T extends DomainEventType>(
    type: T | '*',
    handler: Handler<Extract<DomainEvent, { type: T }>>,
  ): () => void {
    const set = this.handlers.get(type) ?? new Set<Handler>()
    set.add(handler as Handler)
    this.handlers.set(type, set)

    return () => {
      set.delete(handler as Handler)
    }
  }

  emit(event: DomainEvent): void {
    for (const handler of this.handlers.get(event.type) ?? []) handler(event)
    for (const handler of this.handlers.get('*') ?? []) handler(event)
  }

  clear(): void {
    this.handlers.clear()
  }
}

export const eventBus = new EventBus()
