<template>
  <h3 class="my-3">後台產品列表</h3>
  <div class="container">
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">
            分類
          </th>
          <th>產品名稱</th>
          <th width="120">
            原價
          </th>
          <th width="120">
            售價
          </th>
          <th width="100">
            是否啟用
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.origin_price }}</td>
          <td>{{ item.price }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success fw-bold">啟用</span>
            <span v-else class="text-danger fw-bold">未啟用</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;
const router = useRouter();

const products = ref([]);

function getProducts(page = 1) {
  axios.get(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/admin/products/?page=${page}`)
    .then((res) => { products.value = res.data.products; })
    .catch((err) => alert(err.response.data.message));
}

function checkAdmin() {
  axios.post(`${VITE_API_URL}/v2/api/user/check`)
    .then(() => { getProducts(); })
    .catch((err) => {
      alert(err.response.data.message);
      router.push('/login');
    });
}

onMounted(() => {
  // 將 token 從 Cookie 中取出
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
  axios.defaults.headers.common.Authorization = token;
  checkAdmin();
});

</script>

<style scoped>
</style>
