<template>
  <div
    class="card-container"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div class="card-img flex_center">
      <img
        v-if="isHover"
        class="close-image"
        src="@/assets/images/close.svg"
        alt="Ensightful"
        @click.stop="deletePic"
      />
      <img class="card-img-content" :src="imgSrc" alt="Ensightful" />
    </div>
    <div class="pic-text">{{ text }}</div>
  </div>
</template>

<style scoped lang="scss">
.card-container {
  width: 200px;
  height: 220px;
  background-color: rgba(255, 255, 255, 0.48);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 30px;
  transition: all 0.5s;
  &:hover {
    cursor: pointer;
    box-shadow: 0 0 8px rgb(183, 183, 183);
    transition: all 0.3s;
    .card-img {
      width: 195px;
      height: 265px;
      transition: all 0.3s;
    }
    .pic-text {
      transition: all 0.3s;
      font-size: 16px;
    }
  }
  .card-img {
    width: 190px;
    height: 260px;
    transition: all 0.3s;
    position: relative;
    .card-img-content {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
    .close-image {
      width: 22px;
      height: 22px;
      position: absolute;
      top: -11px;
      right: -11px;
    }
  }
  .pic-text {
    position: relative;
    bottom: 20px;
    width: 100%;
    word-wrap: break-word;
    text-align: center;
  }
}
</style>

<script lang="ts" setup>
import { ref, toRefs } from "vue";

const props = defineProps<{
  imgSrc?: string;
  text?: string;
}>();

const emit = defineEmits(["delete"]);

let { imgSrc, text } = toRefs(props);

let isHover = ref<boolean>(false);

const deletePic = () => {
  emit("delete");
};
</script>
