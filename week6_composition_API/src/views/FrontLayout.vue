<template>
  <h1>這裡是前台</h1>
  <ul class="nav nav-pills">
    <li class="nav-item">
      <RouterLink class="nav-link" aria-current="page" to="/">首頁</RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink class="nav-link" aria-current="page" to="/products">產品列表</RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink class="nav-link" aria-current="page" to="/carts">購物車</RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink class="nav-link" aria-current="page" to="/login">登入</RouterLink>
    </li>
  </ul>
  <RouterView></RouterView>
</template>

<script setup>
</script>

<style scoped>
</style>
