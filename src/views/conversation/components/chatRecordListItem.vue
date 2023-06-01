<template>
  <li>
    <div v-if="item.type == 1" class="other" :class="item.sendUserId == userInfo.id ? 'mysay' : 'othersay'">
      <div v-if="item.sendUserId == userInfo.id" >
        <img :src="imgServer + userInfo.avatar" :key="index" />
      </div>      
      <div v-else>
        <img :src="getInfor.sendUserAvatar ? imgServer + getInfor.sendUserAvatar : imgServer + getInfor.friendAvatar" :key="index" />
      </div>
      <div class="whatsay" @click="showActions">
        <div class="whatsay_text whatsay_svg" style="white-space: pre-wrap"  v-html="item.content.replace(/&ul;/g, '_')"></div>        
        <div v-if="item.status == 1" class="whatsay_state" >          
          <i class="iconfont iconamazed"></i>
        </div>
      </div>
    </div>
    <div v-else-if="item.type == 2 && item.receiveUserId !== userInfo.id" class="other mysay">
      <div v-if="item.sendUserId == userInfo.id">
        <img :src="imgServer + userInfo.avatar" />
      </div>
      <div v-else>
        <img :src="getInfor.sendUserAvatar ? imgServer + getInfor.sendUserAvatar : imgServer + getInfor.friendAvatar" :key="index" />
      </div>
      <div class="whatsay">
        <div class="whatsay_svg3 color_invite">[ 您邀请对方加入群聊 ]</div>
        <div class="whatsay_time">{{ item.createTime }}</div>
        <div v-if="item.status == 1" class="whatsay_state"  @click="showActions">         
          <i class="iconfont iconamazed"></i>
        </div>
      </div>
    </div>
    <div v-else-if="item.type == 2 && item.receiveUserId == userInfo.id" class="other othersay">
      <div v-if="item.sendUserId == userInfo.id">
        <img :src="imgServer + userInfo.avatar" :key="index" />
      </div>
      <div v-else>
        <img :src="getInfor.sendUserAvatar ? imgServer + getInfor.sendUserAvatar : imgServer + getInfor.friendAvatar" :key="index" />
      </div>
      <div class="whatsay">
        <div class="whatsay_svg2 color_invite">[ 对方邀请您加入群聊,请点击进入 ]</div>
        <!--  @click="confirmJoinGroup(item,index)" -->
        <div class="whatsay_time">{{ item.createTime }}</div>
        <div v-if="item.status == 1" class="whatsay_state">
          <!--  @click="errorActions(index)" -->
          <i class="iconfont iconamazed"></i>
        </div>
      </div>
    </div>
    <div v-if="item.type == 6 && item.receiveUserId !== userInfo.id" class="other" :class="item.receiveUserId == userInfo.id ? 'othersay' : 'mysay'">
      <div>
        <img :src="imgServer + userInfo.avatar" :key="index" />
      </div>
      <div class="whatsay">
        <div class="whatsay_svg color_invite">[ {{ item.content }} ]</div>
      </div>
    </div>
    <div v-else-if="item.type == 6 && item.receiveUserId == userInfo.id" class="other othersay">
      <div v-if="item.sendUserId == userInfo.id">
        <img :src="imgServer + userInfo.avatar" :key="index" />
      </div>
      <div v-else>
        <img :src="getInfor.sendUserAvatar ? imgServer + getInfor.sendUserAvatar : imgServer + getInfor.friendAvatar" :key="index" />
      </div>
      <div class="whatsay">
        <div class="whatsay_svg2 color_invite">[ {{ item.content }} ]</div>
      </div>
    </div>
    <div v-else-if="item.type == 4" class="other" :class="item.sendUserId == userInfo.id ? 'mysay' : 'othersay'">
      <div v-if="item.sendUserId == userInfo.id"><img :src="imgServer + userInfo.avatar" :key="index" /><!--  @click="showAction(index)" --></div>
      <div v-else>
        <img :src="getInfor.sendUserAvatar ? imgServer + getInfor.sendUserAvatar : imgServer + getInfor.friendAvatar" :key="index" />
      </div>
      <div class="whatsay">
        <div class="whatsay_img">
          <!--@click="enlargeImg(item.content,item,index)"-->
          <img :src="imgServer + '/' + item.content" :ref="index" :onerror="defaultImg" />
        </div>
        <div class="whatsay_time">{{ item.createTime }}</div>
      </div>
    </div>
  </li>
</template>

<script>
import { reactive, toRefs, onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    index:{
      type: String,
      default:""
    }
  },
  emits: ["callback"],
  setup(props,ctx) {
    const store = useStore();

    onMounted(() => {})

    const imgServer = computed(() => {
      return store.state.imgServer;
    });
    const userInfo = computed(() => {
      return store.state.userInfo;
    });

    const getInfor = computed(() => {
      return store.state.infor;
    });
    const showActions =()=>{   
      let param = {
        item: props.item,
        index: props.index
      }    
      ctx.emit("callback",param)
    }
    return {
      imgServer,
      userInfo,
      getInfor,
      showActions
    };
  },
};
</script>

<style lang="scss" scoped></style>
