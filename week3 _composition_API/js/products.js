// Composition API
import { createApp, ref, onMounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.5/vue.esm-browser.min.js';

const app = createApp({
  setup() {
    const url = 'https://ec-course-api.hexschool.io';
    const apiPath = 'vue3-api-use';
    const products = ref([]);
    const tempProduct = ref({
      imagesUrl: []
    });
    const isNew = ref(true);
    let modal = ref(null);
    let delModal = ref(null);

    // 驗證登入
    function checkAdmin() {
      axios.post(`${url}/v2/api/user/check`)
        .then(() => getProducts())
        .catch(err => {
          alert(err.data.message);
          window.location = 'index.html';
        });
    };

    onMounted(() => {
      // 將 token 從 Cookie 中取出
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token;
      checkAdmin();

      // 建立 modal、delModal 實體
      modal = new bootstrap.Modal('#productModal');
      delModal = new bootstrap.Modal('#delProductModal');
    });

    // 取得產品
    function getProducts() {
      axios.get(`${url}/v2/api/${apiPath}/admin/products`)
        .then(res =>  products.value = res.data.products)
        .catch(err => alert(err.data.message));
    };

    function openModal(status, value) {
      if (status === 'create') {
        isNew.value = true;
        tempProduct.value = {imagesUrl: []};
        modal.show();
      } else if (status === 'edit') {
        isNew.value = false;
        tempProduct.value = {...value};
        // 確認多圖設置至少是一個空陣列
        if (tempProduct.value.imagesUrl === undefined) {
          tempProduct.value.imagesUrl = [];
        }
        modal.show();
      } else if (status === 'del') {
        tempProduct.value = {...value};
        delModal.show();
      }
    };

    function updateProduct() {
      let methods = 'post';
      let site = `${url}/v2/api/${apiPath}/admin/product`;

      if (!isNew.value) {
        methods = 'put';
        site = `${url}/v2/api/${apiPath}/admin/product/${tempProduct.value.id}`;
      }

      axios[methods](site, { data: tempProduct.value })
        .then(res => {
          alert(res.data.message);
          modal.hide();
          tempProduct.value = {imagesUrl: []};
          getProducts();
        })
        .catch(err => alert(err.data.message));
    };

    function delProduct(id) {
      axios.delete(`${url}/v2/api/${apiPath}/admin/product/${id}`)
        .then(res =>  {
          alert(res.data.message);
          tempProduct.value = {imagesUrl: []};
          delModal.hide();
          getProducts();
        })
        .catch(err => alert(err.data.message));
    };


    return {
      products,
      tempProduct,
      isNew,
      openModal,
      updateProduct,
      delProduct,
    }

  }
});
app.mount('#app');