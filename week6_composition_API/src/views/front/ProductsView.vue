<template>
  <h3 class="my-3">產品列表</h3>
  <table class="table align-middle">
    <thead>
      <tr>
        <th>圖片</th>
        <th>名稱</th>
        <th>類別</th>
        <th>售價</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <th>
          <img :src="product.imageUrl" class="img-fluid" alt="" style="height: 50px;">
        </th>
        <td>{{ product.title }}</td>
        <td>{{ product.category }}</td>
        <td>{{ product.price }}</td>
        <td>
          <div class="btn-group" role="group" aria-label="Basic mixed styles example">
            <button type="button" class="btn btn-danger"
              @click="getProduct(product.id)">查看</button>
            <button type="button" class="btn btn-warning"
              @click="addToCart(product.id)">加入購物車</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- Modal -->
  <div class="modal modal-lg fade" id="exampleModal" ref="productModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-dark text-light">
          <h5 class="modal-title" id="exampleModalLabel">產品細節</h5>
          <button type="button" class="btn-close btn-close-white"></button>
        </div>
        <div class="modal-body">
          <div class="card mb-3">
            <div class="row g-0">
              <div class="col-5">
                <img :src="productItem.imageUrl" class="img-fluid rounded-start" alt="">
              </div>
              <div class="col-7">
                <div class="card-body">
                  <div>
                    <h5 class="card-title">{{ productItem.title }}</h5>
                    <p class="card-text">{{ productItem.description }}</p>
                    <div>
                      <p class="card-text mb-1"
                        v-if="productItem.origin_price === productItem.price"
                        >{{ `原價: $ ${productItem.origin_price}` }}</p>
                      <p class="">{{ `售價: $ ${productItem.price}` }}</p>
                    </div>
                  </div>
                  <div class="mt-5 d-flex">
                    <div class="input-group">
                      <select class="form-select" id="inputGroupSelect04"
                        v-model="qty">
                        <option selected disabled>請選擇數量</option>
                        <option :value="i" v-for="i in 20" :key="i + 123">{{i}}</option>
                      </select>
                      <button class="btn btn-primary" type="button"
                        @click="addToCart(productItem.id, qty)">加入購物車</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Modal from 'bootstrap/js/dist/modal';

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

const products = ref([]);
const productItem = ref({});
const productModal = ref(null);
const useModal = ref(null);
const qty = ref(1);
function getProducts() {
  axios.get(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/products`)
    .then((res) => { products.value = res.data.products; })
    .catch((err) => alert(err.response.data.message));
}

function getProduct(id) {
  useModal.value.show();
  axios.get(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/product/${id}`)
    .then((res) => {
      productItem.value = res.data.product;
      console.log(productItem.value);
    }).catch((err) => alert(err.response.data.message));
}

function addToCart(productID, num = 1) {
  const data = {
    product_id: productID,
    qty: num,
  };
  axios.post(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/cart`, { data })
    .then((res) => {
      alert(res.data.message);
      useModal.value.hide();
    })
    .catch((err) => alert(err.response.data.message));
}

onMounted(() => {
  useModal.value = new Modal(productModal.value);
  getProducts();
});
</script>

<style scoped>
</style>
