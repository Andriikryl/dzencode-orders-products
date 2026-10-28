<script setup lang="ts">
const links = [
  { to: '/orders', key: 'nav.orders' },
  { to: '/products', key: 'nav.products' },
] as const
</script>

<template>
  <nav class="nav-menu">
    <div class="nav-menu__avatar">
      <i class="bi bi-person-circle" />
    </div>

    <ul class="nav flex-column nav-menu__list">
      <li v-for="link in links" :key="link.to" class="nav-item nav-menu__item">
        <NuxtLink :to="link.to" class="nav-link nav-menu__link">
          {{ $t(link.key) }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-menu {
  width: var(--sidebar-width);
  min-height: 100%;
  background: var(--c-surface);
  border-right: 1px solid var(--c-border);
  padding: 24px 0;
}

.nav-menu__avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  font-size: 88px;
  color: var(--c-border);
  line-height: 1;
}

.nav-menu__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-menu__item + .nav-menu__item {
  margin-top: 28px;
}

.nav-menu__link {
  display: block;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 13px;
  color: var(--c-text);
  padding-bottom: 4px;
  transition: color 0.2s ease;
}

.nav-menu__link:hover {
  color: var(--c-accent);
}

.nav-menu__link.router-link-active {
  color: var(--c-accent);
  border-bottom: 2px solid var(--c-accent);
  width: fit-content;
  margin: 0 auto;
}
</style>
