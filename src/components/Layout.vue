<template>
  <el-menu
    mode="horizontal"
    default-active="camera"
    background-color="rgb(4,21,39)"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <div class="title">ENSIGHTFUL</div>
    <el-menu-item index="camera">Camera module</el-menu-item>
    <div class="welcome">
      Hello, {{ userInfo?.username }}
      <div class="logout" @click="logout">Log Out</div>
    </div>
  </el-menu>
</template>

<style scoped lang="scss">
.title {
  height: 100%;
  padding: 0 60px;
  display: flex;
  align-items: center;
  font-size: 25px;
  font-weight: bolder;
  text-align: left;
  color: #fff;
}

:deep(.el-menu) {
  box-shadow: 0px 10px 2px rgb(255, 255, 255, 0.5) !important;
  z-index: 1000000;
}
.welcome {
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #fff;
  font-weight: bolder;
  position: absolute;
  right: 50px;
  width: 130px;
  justify-content: space-between;
  .logout {
    &:hover {
      cursor: pointer;
    }
  }
}
</style>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const userInfo = ref();
const handleSelect = () => {};

onMounted(() => {
  userInfo.value = JSON.parse(localStorage.getItem("userInfo") as string);
});

const logout = () => {
  sessionStorage.removeItem("userInfo");
  sessionStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("token");
  router.push("/login");
};
</script>
