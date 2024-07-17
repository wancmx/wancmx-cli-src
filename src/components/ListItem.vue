<template>
  <div
    class="list-item flex_center"
    :class="{
      'item-selected': isSelected,
    }"
    ref="listItem"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
  >
    <div>{{ content }}</div>
    <img
      v-if="isHover"
      @click.stop="deleteCameraDevice"
      class="delete-img"
      src="@/assets/images/delete.svg"
      alt="Ensightful"
    />
  </div>
</template>

<style scoped lang="scss">
.list-item {
  height: 30px;
  color: white;
  background-color: rgb(66, 161, 255);
  padding: 5px 10px;
  box-sizing: border-box;
  border-radius: 5px;
  margin: 5px 5px;
  position: relative;
  &:hover {
    cursor: pointer;
    background: rgba(0, 153, 255, 0.4);
  }
}

.item-selected {
  background: rgba(0, 153, 255, 0.4);
}

.delete-img {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
}
</style>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from "vue";

const props = withDefaults(
  defineProps<{
    width?: string;
    content: string | undefined;
    isSelected?: boolean;
  }>(),
  {
    width: "180px",
    content: "",
    isSelected: false,
  }
);

const emit = defineEmits(["delete"]);

let isHover = ref<boolean>(false);

const listItem = ref<HTMLDivElement>();

let { width, content, isSelected } = toRefs(props);

onMounted(() => {
  listItem.value!.style.width = width.value;
});

const deleteCameraDevice = () => {
  emit("delete");
};
</script>
