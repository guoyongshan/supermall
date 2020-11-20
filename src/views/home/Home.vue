<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content"
            ref="scroll"
            v-bind:probe-type="3"
            v-on:scroll="contentScroll"
            v-bind:pull-up-load-="true"
            v-on:pullingUp="loadMore">
      <home-swiper v-bind:banners="banners" class="home-swiper"></home-swiper>
      <recommend-view v-bind:recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control class="tab-control"
                   v-bind:titles="['流行', '新款', '精选']"
                   v-on:tabClick="tabClick"></tab-control>
      <goods-list v-bind:goods="showGoods"></goods-list>
    </scroll>
    <back-top v-on:click.native="backClick" v-show="isShowBackTop"></back-top>
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
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from '@/components/content/backTop/BackTop';

import {getHomeMultidata, getHomeGoods} from "@/network/home";




export default {
  name: "Home",
  components: {
    homeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop

  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      },
      currentType: 'pop',
      isShowBackTop: false
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
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }


  },
  methods: {
    /**
     * 事件监听相关的方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2:
          this.currentType = 'sell'
      }
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
      //console.log('返回顶部点击111')
    },
    contentScroll(position) {
      console.log(position);
      this.isShowBackTop = (-position.y) > 1000;
    },
    loadMore() {
      console.log('上啦加载更多');
    },
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        //console.log("res111111==="+res);
        ///console.log(res);
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
  /*padding-bottom: 110px;*/

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}

.tab-control {
  position: -webkit-sticky;
  top: 44px;
  z-index: 9;
}
.home-swiper {
  margin-top: 44px;
}

.content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px
}

/*.content {*/
/*  overflow: hidden;*/

/*  position: absolute;*/
/*  top: 44px;*/
/*  bottom: 49px;*/
/*  left: 0;*/
/*  right: 0;*/
/*}*/

/*.content {*/
/*height: calc(100% - 93px);*/
/*overflow: hidden;*/
/*margin-top: 44px;*/
/*}*/
</style>
