import {ADD_TO_CART, ADD_COUNTER} from "./mutation-types";

export default {
  addCart(context, payload) {
    //1.payload新添加的商品

    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);

    //2.判断oldproduct
    if(oldProduct) {
      context.commit(ADD_COUNTER, oldProduct);
    }else {
      payload.count = 1;
      context.commit(ADD_TO_CART, payload);
    }
  }
}
