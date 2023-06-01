<template>
  <div class="page_wrap df">
    <slot name="header">
      <v-header
        v-if="showHeader"
        ref="headRef"
        logoPart="true"
        searchPart="true"
        add="true"
      ></v-header>
    </slot>
    <section class="app_contain">
      <slot></slot>
    </section>
    <slot name="footer">
      <v-footer v-if="showFooter" class="shrink-0"></v-footer>
    </slot>
  </div>
</template>

<script>
import vHeader from "@/components/header/head";
import vFooter from "@/components/footer/foot";

export default {
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    vHeader,
    vFooter,
  },
};
</script>

<style lang="scss" scoped>
.page_wrap {
  flex-direction: column;
  height: 100%;
  .app_contain {
    flex: 1;
    overflow-y: auto;
  }
}
.df {
  display: flex;
}
</style>
