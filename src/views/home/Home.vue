<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control class="tab-control"
                 v-bind:titles="['流行', '新款', '精选']"
                 v-on:tabClick="tabClick"
                 ref="tabControl1"
                 v-show="isTabFixed"></tab-control>
    <scroll class="content"
            ref="scroll"
            v-bind:probe-type="3"
            v-on:scroll="contentScroll"
            v-bind:pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper v-bind:banners="banners" v-on:swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view v-bind:recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control class="tab-control"
                   v-bind:titles="['流行', '新款', '精选']"
                   v-on:tabClick="tabClick"
                   ref="tabControl2"></tab-control>
      <goods-list v-bind:goods="showGoods"></goods-list>
    </scroll>
    <back-top v-on:click.native="backClick" v-show="isShowBackTop"></back-top>

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
import {itemListenerMixin} from "../../common/mixin";


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
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  mixins: [itemListenerMixin],
  created() {
    //1.请求多个数据
    this.getHomeMultidata()
    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {

  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  destroyed() {
    console.log('destroyed');
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    //1.保存Y值
    this.saveY = this.$refs.scroll.scroll.y;

    //2.取消全局事件监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
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
          break;
      }
      if(this.$refs.tabControl1 !== null) {
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      }

    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
      //console.log('返回顶部点击111')
    },
    contentScroll(position) {
      //console.log(position);
      //1.判断backtop是否显示
      this.isShowBackTop = (-position.y) > 1000;

      //2、决定tabcontrol是否吸顶（position:fixed）
      this.isTabFixed = (-position.y) > this.tabOffsetTop;
    },
    loadMore() {
      //console.log('上啦加载更多');
      this.getHomeGoods(this.currentType);
    },
    swiperImageLoad() {
      console.log(this.$refs.tabControl2.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
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

        //完成上拉加载更多
        this.$refs.scroll.finishPullUp();
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

  /*position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;*/
}

.tab-control {
  position: relative;
  z-index: 9;
}
.home-swiper {
  margin-top: 44px;
}

.content {
  overflow: hidden;
  position: absolute;
  /*//height: calc(100% - 93px);*/

  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
/*.fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
}*/
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
