<template>
  <div class="detail-swiper">
    <swiper class="swiper-a">
      <swiper-item v-for="(item, index) in topImages">
        <img v-bind:src="item" alt>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: "DetailSwiper",
    components: {
      Swiper,
      SwiperItem
    },
    props: {
      topImages: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .swiper-a {
    height: 300px;
    overflow: hidden;
  }
</style>
