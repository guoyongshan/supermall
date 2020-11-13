<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <home-swiper v-bind:banners="banners"></home-swiper>
    <recommend-view v-bind:recommends="recommends"></recommend-view>
    <feature-view></feature-view>
    <tab-control class="tab-control" v-bind:titles="['流行', '新款', '精选']"></tab-control>
    <goods-list v-bind:goods="goods['pop'].list"></goods-list>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
    <li>111111</li>
  </div>
</template>

<script>
import homeSwiper from "@/views/home/childComps/homeSwiper";
import RecommendView from "@/views/home/childComps/RecommendView";
import FeatureView from "@/views/home/childComps/FeatureView";

import NavBar from '@/components/common/navbar/NavBar';
import TabControl from "@/components/content/tabControl/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";

import {getHomeMultidata, getHomeGoods} from "@/network/home";



export default {
  name: "Home",
  components: {
    NavBar,
    homeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      }
    }
  },
  created() {
    //1.请求多个数据
    this.getHomeMultidata()
    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  methods: {
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type,page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
      })
    }
  }
}
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}

.tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
}

.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

/*.content {*/
/*height: calc(100% - 93px);*/
/*overflow: hidden;*/
/*margin-top: 44px;*/
/*}*/
</style>
