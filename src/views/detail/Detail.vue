<template>
  <div id="detail">
    <detail-nav-bar></detail-nav-bar>
    <detail-swiper v-bind:top-images="topImages"></detail-swiper>
    <detail-base-info v-bind:goods="goods"></detail-base-info>
    <detail-shop-info v-bind:shop="shop"></detail-shop-info>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";

  import {getDetail, Goods, Shop} from "../../network/detail";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      getDetail,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {}
      }
    },
    created() {
      //1、保存传入的iid
      this.iid = this.$route.params.iid;

      //2、根据iid请求详情数据
      getDetail(this.iid).then(res => {
        //1.获取顶部的轮播图数据
        console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages;
        //2.获取商品数据
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

        //3.创建店铺信息对象
        this.shop = new Shop(data.shopInfo);
      })
    }
  }
</script>

<style scoped>

</style>
