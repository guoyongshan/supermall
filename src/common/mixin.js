//混入 mixin
import {debounce} from "./utils";
import BackTop from "../components/content/backTop/BackTop";
import {BACKTOP_DISTANCE} from "./const";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 200);
    this.itemImgListener = () => {
      this.refresh()}
    this.$bus.$on('itemImageLoad', this.itemImgListener);
    console.log('我是混入中的内容');
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    listenShoBackTop(position) {
      this.isShowBackTop = (-position.y) > BACKTOP_DISTANCE;
    }
  }

}
