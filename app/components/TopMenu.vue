<script setup lang="ts">
import dayjs from 'dayjs'
import { useSessionCounter } from '~/composables/useSessionCounter'

const WEEKDAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const weekday = computed(() => WEEKDAYS[now.value.getDay()])
const date = computed(() => {
  const d = dayjs(now.value)
  return `${d.format('DD')} ${MONTHS[d.month()]}, ${d.format('YYYY')}`
})
const time = computed(() => dayjs(now.value).format('HH:mm:ss'))

const { activeSessions } = useSessionCounter()

const { locale, locales, setLocale } = useI18n()
const localeOptions = computed(() => locales.value.map((item) => (typeof item === 'string' ? { code: item, name: item } : item)))
</script>

<template>
  <header class="top-menu">
    <div class="top-menu__brand">
      <i class="bi bi-shield-fill accent top-menu__brand-icon" />
      <span class="top-menu__brand-text">INVENTORY</span>
    </div>

    <div class="top-menu__search">
      <input
        type="search"
        class="form-control"
        :placeholder="$t('topMenu.search')"
        :aria-label="$t('topMenu.search')"
      >
    </div>

    <div class="top-menu__meta">
      <select
        class="form-select form-select-sm top-menu__locale"
        :value="locale"
        :aria-label="'Language'"
        @change="setLocale(($event.target as HTMLSelectElement).value as typeof locale)"
      >
        <option v-for="item in localeOptions" :key="item.code" :value="item.code">
          {{ item.name }}
        </option>
      </select>

      <div class="top-menu__sessions" :title="$t('topMenu.sessions')">
        <i class="bi bi-people-fill" />
        <ClientOnly>
          <span class="top-menu__sessions-count">{{ activeSessions }}</span>
          <template #fallback>
            <span class="top-menu__sessions-count">—</span>
          </template>
        </ClientOnly>
      </div>

      <div class="top-menu__clock">
        <div class="top-menu__weekday">{{ weekday }}</div>
        <div class="top-menu__date">
          <span>{{ date }}</span>
          <i class="bi bi-clock top-menu__clock-icon" />
          <ClientOnly>
            <span>{{ time }}</span>
            <template #fallback>
              <span>--:--:--</span>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-menu {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 32px;
  background: var(--c-surface);
  border-bottom: 1px solid var(--c-border);
}

.top-menu__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-menu__brand-icon {
  font-size: 26px;
}

.top-menu__brand-text {
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--c-accent);
}

.top-menu__search {
  flex: 1;
  max-width: 420px;
}

.top-menu__meta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 24px;
}

.top-menu__locale {
  width: auto;
}

.top-menu__sessions {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-muted);
}

.top-menu__sessions-count {
  font-weight: 600;
  color: var(--c-text);
}

.top-menu__clock {
  text-align: right;
}

.top-menu__weekday {
  color: var(--c-text-muted);
  font-size: 12px;
}

.top-menu__date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.top-menu__clock-icon {
  color: var(--c-accent);
}
</style>
