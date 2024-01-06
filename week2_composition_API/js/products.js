import { createApp, ref, onMounted  } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.5/vue.esm-browser.min.js';

const url = 'https://ec-course-api.hexschool.io';
const apiPath = 'vue3-api-use';

const app = createApp({
  setup() {
    const products = ref([]);
    const tempProduct = ref({});

    const checkAdmin = () => {
      axios.post(`${url}/v2/api/user/check`)
        .then(() => getProducts())
        .catch(err => {
          alert(err.data.message);
          window.location = 'index.html';
        });
    };

    const getProducts = () => {
      axios.get(`${url}/v2/api/${apiPath}/admin/products`)
        .then(res => products.value = res.data.products)
        .catch(err => alert(err.data.message));
    };
    
    onMounted(() => {
      // 將 token 從 Cookie 中取出，並存至 'Authorization' 中
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token;

      checkAdmin();
    });

    return {
      products,
      tempProduct,
    };

  }
});
app.mount('#app');