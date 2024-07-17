<template>
  <div class="container">
    <Layout v-if="!isShowLayout"></Layout>
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue";
import Layout from "./components/Layout.vue";
import { piniaPageInfo } from "./store/pageInfo";

const pageInfo = piniaPageInfo();
const whiteList = ref<Array<string>>([
  "/login",
  "/register",
  "/forgotPassword",
]);

let isShowLayout = computed(() => {
  return whiteList.value.some((str) => {
    return str === pageInfo.pathRouter;
  });
});
</script>
