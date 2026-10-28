import { eventBus, type DomainEvent, type DomainEventType } from '~/lib/events'

export function useDomainEvents() {
  const stops: Array<() => void> = []

  function on<T extends DomainEventType>(
    type: T | '*',
    handler: (event: Extract<DomainEvent, { type: T }>) => void,
  ) {
    stops.push(eventBus.on(type, handler))
  }

  onScopeDispose(() => {
    for (const stop of stops) stop()
    stops.length = 0
  })

  return { on, emit: (event: DomainEvent) => eventBus.emit(event) }
}
