import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.5/vue.esm-browser.min.js';

const url = 'https://ec-course-api.hexschool.io';
const apiPath = 'vue3-api-use';

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
    }
  },
  methods: {
    checkAdmin() {
      axios.post(`${url}/v2/api/user/check`)
        .then(() => this.getProducts())
        .catch(err => {
          alert(err.data.message);
          window.location = 'index.html';
        });
    },
    getProducts() {
      axios.get(`${url}/v2/api/${apiPath}/admin/products`)
        .then(res => {
          this.products = res.data.products;
        }).catch(err => console.log(err));
    },
  },
  mounted() {
    // 將 token 從 Cookie 中取出，並存入至 'Authorization' 中
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    
    this.getProducts();
  },
});
app.mount('#app');