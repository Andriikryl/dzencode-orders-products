<script setup lang="ts"></script>

<template>
  <div class="layout">
    <TopMenu />
    <div class="container-fluid px-0 layout__body">
      <NavigationMenu />
      <main class="layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout__body {
  flex: 1;
  display: flex;
  align-items: stretch;
}

.layout__content {
  flex: 1;
  padding: 32px 40px;
  min-width: 0;
}

@media (max-width: 768px) {
  .layout__body {
    flex-direction: column;
  }

  .layout__content {
    padding: 20px 16px;
  }
}
</style>
