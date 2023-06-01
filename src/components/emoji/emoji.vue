<template>
  <section class="emoji">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item
        class="mo-emoji-box"
        v-for="(item, index) in emojisArr"
        :key="index"
      >
        <span
          class="mo-emoji-icon"
          v-for="(_item, _index) in item"
          :key="_index"
          @click="handleClick(_item)"
        >
          {{ _item.native }}
        </span>
      </van-swipe-item>
    </van-swipe>
  </section>
</template>
<script>
import { chunk } from "lodash";
import config from "./config";
import { onMounted, ref } from "vue";

export default {
  props: {},
  emits: ["clickFn"],
  setup(props, ctx) {
    const emojisArr = ref([]);
    onMounted(() => {
      initFn();
    });
    const initFn = () => {
      emojisArr.value = chunk(config, 21);
    };
    const handleClick = (item) => {
      ctx.emit("clickFn", item);
    };

    return {
      emojisArr,
      handleClick,
    };
  },
};
</script>

<style lang="scss">
.emoji {
  .mo-emoji-icon {
    font-size: 24px;
    width: 48px;
    height: 48px;
    display: block;
    float: left;
    text-align: center;
  }

  .carousel {
    height: 120px;
    padding: 20px 10px;
    .slider-frame {
      padding-bottom: 30px;
    }
    .mo-emoji-box {
      display: block;
      height: 100px;
      padding-bottom: 50px;
    }
  }
}
</style>
