<template>
  <div class="bottom-bar">
    <div class="bottom-content">
      <check-button v-bind:is-checked="isSelectAll"
                    class="check-button"
                    v-on:click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">
      合计:{{totalPrice}}
    </div>

    <div class="calculate" v-on:click="calcClick">
      去计算:({{checkLenght}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "../../../components/content/checkButton/CheckButton";

  import {mapGetters} from 'vuex';

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return this.$store.state.cartList.filter(item => {
          return item.checked;
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count;
        }, 0).toFixed(2);
        // return this.$store.getters.cartList;
      },
      checkLenght() {
        return this.cartList.filter(item => item.checked).length;
      },
      isSelectAll() {
        //return (this.cartList.filter(item => !item.checked).length);
        if(this.cartList.length === 0) return false;
        return !this.cartList.find(item => !item.checked);
      }
    },
    methods: {
      checkClick() {
        if(this.isSelectAll) {
          this.cartList.forEach(item => item.checked = false)
        }else {
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if(!this.isSelectAll) {
          this.$toast.show('请选择购买的商品', 2000);
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;

    height: 40px;
    line-height: 40px;

    background-color: #eee;

    font-size: 14px;
  }
  .bottom-content {
    display: flex;
    align-items: center;
    width: 60px;
  }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 22px;
    margin-right: 5px;
  }
  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background: red;
    text-align: center;

  }
</style>
