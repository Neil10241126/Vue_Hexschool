const { createApp } = Vue;
const url = 'https://ec-course-api.hexschool.io';
const apiPath = 'vue3-api-use';

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const productModal = {
  props: ['tempProduct', 'addToCart', 'status'],
  template: '#userProductModal',
  data() {
    return {
      modal: null,
      qty: 1,
    }
  },
  watch: {
    tempProduct() {
      this.qty = 1;
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.bsModal)
  },
}

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      cart: [],
      status: {
        addToCartLoading: false,
        deleteLoading: false,
      },
      data: {
        user: {},
        message: '',
      }
    }
  },
  components: {
    productModal,
  },
  methods: {
    getProducts() {
      axios.get(`${url}/v2/api/${apiPath}/products`)
        .then(res => this.products = res.data.products)
        .catch(err => alert(err.data.message));
    },
    openModal(value) {
      this.$refs.userModal.modal.show();
      this.tempProduct = {...value};
    },
    addToCart(product_id, qty = 1) {
      const data = {
        product_id,
        qty
      };
      this.status.addToCartLoading = true;
      axios.post(`${url}/v2/api/${apiPath}/cart`, { data })
        .then(res => {
          alert(res.data.message);
          this.$refs.userModal.modal.hide();
          this.getCart();
          this.status.addToCartLoading = false;
        })
        .catch(err => {
          alert(err.data.message);
          this.status.addToCartLoading = false;
        });
    },
    getCart() {
      axios.get(`${url}/v2/api/${apiPath}/cart`)
        .then(res => this.cart = res.data.data)
        .catch(err => alert(err.data.message));
    },
    chagneNum(value, qty) {
      const data = {
        product_id: value.product_id,
        qty,
      };
      axios.put(`${url}/v2/api/${apiPath}/cart/${value.id}`, { data })
        .then(() => {
          this.getCart();
        }).catch(err => alert(err.data.message));
    },
    delCartList() {
      axios.delete(`${url}/v2/api/${apiPath}/carts`)
        .then(res => {
          alert(res.data.message);
          this.getCart();
        }).catch(err => alert(err.data.message));
    },
    delCartItem(id) {
      this.status.deleteLoading = true;
      axios.delete(`${url}/v2/api/${apiPath}/cart/${id}`)
        .then(res => {
          alert(res.data.message);
          this.getCart();
          this.status.deleteLoading = false;
        }).catch(err => {
          alert(err.data.message);
          this.status.deleteLoading = false;
        });
    },
    onSubmit() {
      axios.post(`${url}/v2/api/${apiPath}/order`, { data: this.data })
        .then(res => alert(res.data.message))
        .catch(err => alert(err.data.message));
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');