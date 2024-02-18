<template>
  <div class="container">
    <div class="row justify-content-center align-items-center mt-5">
      <h1 class="h3 mb-3 font-weight-normal text-center">
        請先登入
      </h1>
      <div class="col-4">
        <form id="form" class="form-signin">
          <div class="form-floating mb-3">
            <input type="email" class="form-control" id="username"
              placeholder="name@example.com" required autofocus
              v-model="user.username">
            <label for="username">Email address</label>
          </div>
          <div class="form-floating">
            <input type="password" class="form-control" id="password"
              placeholder="Password" required
              autocomplete="on"
              v-model="user.password"
              @keyup.enter="login()">
            <label for="password">Password</label>
          </div>
          <button class="btn btn-lg btn-primary w-100 mt-3" type="button"
            @click="login()">
            登入
          </button>
        </form>
      </div>
    </div>
    <p class="mt-5 mb-3 text-muted text-center">
      &copy; 2021~∞ - 六角學院
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const { VITE_API_URL } = import.meta.env;
const router = useRouter();
const user = ref({
  username: '',
  password: '',
});

function login() {
  axios.post(`${VITE_API_URL}/v2/admin/signin`, user.value)
    .then((res) => {
      // 取出 token expired 並存入至 cookie
      const { token, expired: expires } = res.data;
      document.cookie = `token=${token}; expires=${expires}; path=/`;
      alert(res.data.message);
      router.push('/admin/products');
    }).catch((err) => alert(err.response.data.message));
}
</script>

<style scoped>
</style>
