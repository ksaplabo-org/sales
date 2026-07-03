<template>
  <div class="layout">
    <AppSidebar />

    <div class="main-area">
      <AppNavbar />

      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from "@/components/Menu.vue";
import AppNavbar from "@/components/NaviMenu.vue";
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  padding: 24px;
}
</style>
