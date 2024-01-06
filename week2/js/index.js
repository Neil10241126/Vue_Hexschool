import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.5/vue.esm-browser.min.js';

const url = 'https://ec-course-api.hexschool.io';

const app = createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    login() {
      axios.post(`${url}/v2/admin/signin`, this.user)
        .then(res => {
          // 取出 token expired 存入至 cookie 中
          const { token, expired } = res.data;
          document.cookie = `token=${token}; expires=${expired}; path=/`

          // 確認後轉址
          alert(res.data.message);
          window.location = 'products.html';
        }).catch(err => alert(err.data.message));
    },
  },
});
app.mount('#app');

