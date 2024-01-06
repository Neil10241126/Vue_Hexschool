import { createApp, ref } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.5/vue.esm-browser.min.js';

const url = 'https://ec-course-api.hexschool.io';

const app = createApp({
  setup() {
    const user = ref({
      username: '',
      password: '',
    });

    const login = () => {
      axios.post(`${url}/v2/admin/signin`, user.value)
        .then(res => {
          // 取出 token expired 並存入至 cookie
          const { token, expired: expires } = res.data;
          document.cookie = `token=${token}; expires=${expires}; path=/`;

          alert(res.data.message);
          window.location = 'products.html';
        }).catch(err => alert(err.data.message));
    };

    return {
      user,
      login,
    };
  }
});
app.mount('#app');