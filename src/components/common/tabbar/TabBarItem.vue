<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive" > <slot name="icon"></slot></div>
    <div v-else><slot name="active-icon"></slot></div>
    <div v-bind:style="activeStyle"><slot name="text"></slot></div>

  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    path: {
      type: String,
      required: true
    },
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  data() {
    return {
      //isActive: true
    }
  },
  computed:{
    isActive(){
      return this.$route.path.indexOf(this.path) !== -1
    },
    activeStyle(){
      return this.isActive?{color:this.activeColor}:{}
    }

  },

  methods: {
    itemClick() {

      console.log('itemClick')
      this.$router.replace(this.path)
    }

  }
}
</script>

<style scoped>
.tab-bar-item{
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}
.tab-bar-item img{
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-bottom: 2px;
}

</style>
