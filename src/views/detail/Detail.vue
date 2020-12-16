<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" v-on:titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" v-bind:probe-type="3" v-on:scroll="contentScroll">
      <detail-swiper v-bind:top-images="topImages"></detail-swiper>
      <detail-base-info v-bind:goods="goods"></detail-base-info>
      <detail-shop-info v-bind:shop="shop"></detail-shop-info>
      <detail-goods-info v-bind:detail-info="detailInfo" v-on:imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" v-bind:param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" v-bind:comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" v-bind:goods="recommends"></goods-list>
    </scroll>
    <detail-botton-bar v-on:addToCart="addToCart"/>
    <back-top v-on:click.native="backClick" v-show="isShowBackTop"></back-top>
<!--    <toast v-bind:message="message" v-bind:show="show"/>-->
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottonBar from "./childComps/DetailBottonBar";
  // import Toast from "../../components/common/toast/Toast";

  import Scroll from "../../components/common/scroll/Scroll";
  import GoodsList from "../../components/content/goods/GoodsList";

  import {getDetail, getRecommend, Goods, GoodsParam, Shop} from "../../network/detail";

  import {itemListenerMixin, backTopMixin} from "../../common/mixin";
  import {debounce} from "../../common/utils";

  import { mapActions } from 'vuex';

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      getDetail,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottonBar,
      Scroll,
      GoodsList,
      // Toast
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    created() {
      //1、保存传入的iid
      this.iid = this.$route.params.iid;

      //2、根据iid请求详情数据
      getDetail(this.iid).then(res => {
        //1.获取顶部的轮播图数据
        //console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages;
        //2.获取商品数据
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

        //3.创建店铺信息对象
        this.shop = new Shop(data.shopInfo);

        //4.保存商品详情数据
        this.detailInfo = data.detailInfo;

        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

        //6.取出评论的信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }

        this.$nextTick(() => {
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop);//参数的offsetTop
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop);//评论的offsetTop
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);//推荐的offsetTop

          //console.log(this.themeTopYs);
        });



      });

      //3.请求推荐数据
      getRecommend().then(res => {
        //console.log(res.data.list);
        this.recommends = res.data.list;
      });
      //4.给getThemeTopY赋值，（对给this.ThemeTopY赋值的操作进行防抖）
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop-44);//参数的offsetTop
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44);//评论的offsetTop
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44);//推荐的offsetTop

        console.log(this.themeTopYs);
      }, 200)
    },
    methods: {
      ...mapActions({
        add: 'addCart'
      }),

      addToCart() {
        //1.获取购物车需要展示的信息
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        //2.将商品添加到购物车里
        this.add(product).then(res => {
          // this.message = res;
          // this.show = true;
          //
          // setTimeout(() => {
          //   this.message = '';
          //   this.show = false;
          // }, 1500)

          this.$toast.show(res, 2000);
        });

        //this.$store.cartList.push(product);
        //this.$store.dispatch('addCart', product).then(res => console.log(res));不通过mapActions

      },
      imageLoad() {
        this.refresh();
        //this.$refs.scroll.refresh();

        this.getThemeTopY();
      },
      titleClick(index) {
        //console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
      },
      contentScroll(position) {
        //1.获取y值
        const positionY = -position.y;

        //2.positionY和主题中值进行对比
        let lenght = this.themeTopYs.length;
        for(let i = 0; i < lenght; i++) {
          if(this.currentIndex !== i && ((i < lenght - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||
            (i === lenght - 1 && positionY >= this.themeTopYs[i]))) {

            this.currentIndex = i;
            //console.log(this.currentIndex);
            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }

        //3.判断backtop是否显示
        this.listenShoBackTop(position);
      }
    },
    mixins: [itemListenerMixin, backTopMixin],
    mounted() {

    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 99;
    background-color: #fff;
    height: 100vh;
    overflow: hidden;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
