import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.5/vue.esm-browser.min.js';

const url = 'https://ec-course-api.hexschool.io';
const apiPath = 'vue3-api-use';

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: []
      },
      isNew: true,
      modal: {},
      delModal: {},
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
        .then(res =>  this.products = res.data.products)
        .catch(err => console.log(err));
    },
    openModal(status, value) {
      if (status === 'create') {
        this.isNew = true;
        this.tempProduct = {imagesUrl: []};
        this.modal.show();
      } else if (status === 'edit') {
        this.isNew = false;
        this.tempProduct = {...value};
        // 確認多圖設置至少是一個空陣列
        if (this.tempProduct.imagesUrl === undefined) {
          this.tempProduct.imagesUrl = [];
        }
        this.modal.show();
      } else if (status === 'del') {
        this.tempProduct = {...value};
        this.delModal.show();
      }
    },
    updateProduct() {
      let methods = 'post';
      let site = `${url}/v2/api/${apiPath}/admin/product`;

      if (!this.isNew) {
        methods = 'put';
        site = `${url}/v2/api/${apiPath}/admin/product/${this.tempProduct.id}`;
      }

      axios[methods](site, { data:this.tempProduct })
        .then(res => {
          alert(res.data.message);
          this.modal.hide();
          this.tempProduct = {imagesUrl: []};
          this.getProducts();
        })
        .catch(err => alert(err.data.message));
    },
    delProduct(id) {
      axios.delete(`${url}/v2/api/${apiPath}/admin/product/${id}`)
        .then(res =>  {
          alert(res.data.message);
          this.tempProduct = {imagesUrl: []};
          this.delModal.hide();
          this.getProducts();
        })
        .catch(err => alert(err.data.message));
    },
  },
  mounted() {
    // 將 token 從 Cookie 中取出
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    this.checkAdmin();

    // 建立 modal、delModal 實體
    this.modal = new bootstrap.Modal('#productModal');
    this.delModal = new bootstrap.Modal('#delProductModal');

    console.log(this.tempProduct.imagesUrl.length);
  },
});
app.mount('#app');