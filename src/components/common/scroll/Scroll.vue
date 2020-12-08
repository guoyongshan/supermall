<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    name: "Scroll",
    data() {
      return {
        scroll: null
      }
    },
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },

    mounted() {
      //1.创建BScroll对象
      ///console.log(document.querySelector('.wrapper'));
      //console.log("ref获取模块对象" + this.$refs.wrapper);
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      //2.监听滚动的位置
      this.scroll.on('scroll', (position) => {
        //console.log(position);
        this.$emit('scroll',position)
      })

      //3.监听上啦加载更多
      this.scroll.on('pullingUp', () => {
        //console.log("上啦加载跟多");
        this.$emit('pullingUp');
      })
    },
    methods: {
      scrollTo(x, y, time=500) {
        this.scroll.scrollTo(x, y, time);
      },
      finishPullUp() {
        this.scroll.finishPullUp();
      },
      refresh() {
        //console.log('-------=======123');
        this.scroll && this.scroll.refresh();
      }
    }
  }
</script>

<style scoped>

</style>
