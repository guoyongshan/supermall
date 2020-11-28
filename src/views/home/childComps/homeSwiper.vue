<template>
  <Swiper>
    <SwiperItem v-for="item in banners">
      <a v-bind:href="item.link">
        <img v-bind:src="item.image" v-on:load="imageLoad">
      </a>
    </SwiperItem>
  </Swiper>
</template>

<script>
import {Swiper, SwiperItem} from "@/components/common/swiper";

export default {
  name: "homeSwiper",
  data() {
    return {
      isLoad: false
    }
  },
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {
    imageLoad() {
      //console.log('-----------');
      if(!this.isLoad) {
        this.$emit('swiperImageLoad');
        this.isLoad = true;
      }
    }
  }
}
</script>

<style scoped>

</style>
