<template>
  <div class="favor" ref="favorRef">
    <h2>未完待续</h2>
    <h3>
      详细开发思路请
      <a
        href="https://devin.ren/project/trip-mobile-vue3/01-%E9%A6%96%E9%A1%B5tabbar%E3%80%81navBar%E3%80%81banner%E3%80%81location.html#navbar%E3%80%81banner%E3%80%81location"
        style="font-color: blue"
        >点击这里</a
      >
      查看
    </h3>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useScroll from "@/hooks/useScroll";

const favorRef = ref();

useScroll(favorRef);
</script>

<style lang="less" scoped></style>
