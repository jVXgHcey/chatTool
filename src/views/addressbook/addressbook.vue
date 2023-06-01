<template>
  <v-page>
    <section class="dialogue">
      <div class="conversation">
        <van-list
          v-model="loading"
          :loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <addressItem
            class="item"
            v-for="(i, index) in addressList"
            :key="index"
            :item="i"
            @callback="deleteFriend"
          />
        </van-list>
      </div>
    </section>
  </v-page>
</template>
<script>
import { reactive, onMounted, toRefs, ref } from "vue";
import { Toast } from "vant";
import { useRoute, useRouter } from "vue-router";
import addressItem from "./components/addressItem.vue";
import { getFriendPage } from "@/service/getData";
import {
  setStore,
  getStore,
  formatTime,
  getToken,
  fakeFindLastIndex,
} from "@/mUtils/utils";
import { useStore } from "vuex";

export default {
  components: {
    addressItem,
  },
  setup() {
    const addressList = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      fetching: false,
      pageNum: 1,
      pageSize: 10,
    });
    onMounted(async () => {
      onLoad();
    });

    const onLoad = async () => {
      try {
        let params = {
          pageNum: state.pageNum,
          pageSize: state.pageSize,
        };
        if (state.fetching) {
          return;
        }
        state.fetching = true;
        loading.value = true;
        const res = await getFriendPage(params);
        addressList.value = [...addressList.value, ...res.data.content];
        state.pageNum++;
        loading.value = false;
        finished.value = addressList.value.length > res.data.totalElements;
        state.fetching = false;
      } catch (error) {
        finished.value = true;
        loading.value = false;
        state.fetching = false;
      }
    };

    const deleteFriend = async () => {
      let params = {
        pageNum: 1,
        pageSize: state.pageSize,
      };
      const res = await getFriendPage(params);
      addressList.value = res.data.content;
    };
    return {
      ...toRefs(state),
      addressList,
      onLoad,
      loading,
      finished,
      deleteFriend,
    };
  },
};
</script>
