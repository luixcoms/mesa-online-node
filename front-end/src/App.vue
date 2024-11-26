<script setup>
import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <div class="wrapper">
    <Navbar />
    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.name" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
main {
  background-color: var(--light-pink);
  margin-top: var(--top-spacing);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-out;
}
</style>
