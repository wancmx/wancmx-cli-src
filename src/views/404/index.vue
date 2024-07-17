<template>
  <div class="width_100 height_100 flex_center">
    <el-empty class="empty" description="404 not found">
      <span class="likea" @click="toHomePage"
        >You can click here to return to the homepage</span
      >
    </el-empty>
  </div>
</template>

<style scoped lang="scss">
.empty {
  position: relative;
  bottom: 60px;
}
</style>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();
const toHomePage = () => {
  router.push({
    path: "/",
  });
};
</script>
