<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.card {
  background-color: rgba(255, 255, 255, 0.33);
  box-shadow: 0px 8px 32px 0 rgba(0, 0, 255, 0.33);
  backdrop-filter: blur(3px);
  padding: 16px 16px 0px 16px;
  border-radius: 16px;
  min-width: 240px;
}
</style>

<script setup lang="ts"></script>
