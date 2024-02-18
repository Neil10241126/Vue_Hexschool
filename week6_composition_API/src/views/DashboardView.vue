<template>
  <h1>這裡是後台</h1>
  <ul class="nav nav-pills">
    <li class="nav-item">
      <RouterLink class="nav-link" aria-current="page" to="/admin/products">產品列表</RouterLink>
    </li>
    <li class="nav-item">
      <button class="nav-link" type="button" @click="logout()">登出</button>
    </li>
  </ul>
  <RouterView></RouterView>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';

const { VITE_API_URL } = import.meta.env;
const router = useRouter();

function logout() {
  axios.post(`${VITE_API_URL}/v2/logout`)
    .then((res) => {
      alert(res.data.message);
      router.push('/');
    }).catch((err) => console.log(err));
}

</script>

<style scoped>
</style>
