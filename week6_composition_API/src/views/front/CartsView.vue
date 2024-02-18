<template>
  <h3 class="my-3">購物車</h3>
  <div class="text-end mb-3">
    <button class="btn btn-outline-danger"
      @click="delCartList()">清除購物車</button>
  </div>
  <table class="table align-middle">
    <thead>
      <tr>
        <th>取消</th>
        <th>品項</th>
        <th>單價</th>
        <th style="width: 150px">數量</th>
        <th class="text-end">總價</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cart in cart.carts" :key="cart.id">
        <th>
          <button type="button" class="btn btn-sm btn-outline-danger"
            @click="delCartItem(cart.id)">X</button>
        </th>
        <td>{{ cart.product.title }}</td>
        <td>$ {{ cart.product.price }}</td>
        <td>
          <div class="input-group input-group-sm">
              <div class="input-group">
                <input min="1" type="number" class="form-control"
                v-model="cart.qty"
                @change="changeNum(cart.id, cart.qty)">
                <span class="input-group-text" id="basic-addon2">{{ cart.product.unit }}</span>
              </div>
            </div>
        </td>
        <td class="text-end">$ {{ cart.total }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4" class="text-end">總計</td>
        <td class="text-end">$ {{ cart.total }}</td>
      </tr>
    </tfoot>
  </table>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

const cart = ref([]);
function getCarts() {
  axios.get(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/cart`)
    .then((res) => {
      cart.value = res.data.data;
      // console.log(cart.value);
    }).catch((err) => alert(err.response.data.message));
}

function delCartList() {
  axios.delete(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/carts`)
    .then((res) => {
      alert(res.data.message);
      getCarts();
    }).catch((err) => alert(err.response.data.message));
}

function delCartItem(id) {
  axios.delete(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/cart/${id}`)
    .then((res) => {
      alert(res.data.message);
      getCarts();
    }).catch((err) => alert(err.response.data.message));
}

function changeNum(id, qty) {
  const data = {
    product_id: id,
    qty,
  };
  axios.put(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/cart/${id}`, { data })
    .then(() => getCarts())
    .catch((err) => alert(err.response.data.message));
}

onMounted(() => {
  getCarts();
});

</script>

<style scoped>
</style>
