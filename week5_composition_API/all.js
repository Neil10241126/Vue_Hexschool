const { createApp, ref, onMounted } = Vue;
import { url, apiPath } from './env.js';
import productModal from "./components/productModal.js";

// VeeValidate 定義規則
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

const app = createApp({
  components: {
    productModal,
  },
  setup() {
    // 產品列表
    const products = ref([]);
    const getProducts = () => {
      axios.get(`${url}/v2/api/${apiPath}/products`)
        .then(res => products.value = res.data.products)
        .catch(err => alert(err.data.message));
    };
    onMounted(() => {
      getProducts();
      getCart();
    });

    // 單一產品細節 
    const modalRef = ref(null);
    const tempProduct = ref({});
    const getProduct = (id) => {
      axios.get(`${url}/v2/api/${apiPath}/product/${id}`)
        .then(res => {
          tempProduct.value = res.data.product;
          modalRef.value.openModal();
        }).catch(err => alert(err.data.message));
    };

    //取得購物車列表
    const cart = ref([]);
    const getCart = () => {
      axios.get(`${url}/v2/api/${apiPath}/cart`)
        .then(res => {
          cart.value = res.data.data;
        })
        .catch(err => alert(err.data.message));
    };

    // 加入購物車
    const addToCart = (product_id, qty = 1) => {
      const data = {
        product_id,
        qty
      };
      status.value.addCartLoading = true;
      axios.post(`${url}/v2/api/${apiPath}/cart`, { data })
        .then(res => {
          alert(res.data.message);
          modalRef.value.closeModal();
          getCart();
          status.value.addCartLoading = false;
        }).catch(err => {
          alert(err.data.message);
          status.value.addCartLoading = false;
        });
    };

    // 全部刪除
    const delCartList = () => {
      axios.delete(`${url}/v2/api/${apiPath}/carts`)
        .then(res => {
          alert(res.data.message);
          getCart();
        })
        .catch(err => alert(err.data.message));
    };
    // 單一刪除
    const delCartItem = (id) => {
      status.value.addCartLoading = true;
      axios.delete(`${url}/v2/api/${apiPath}/cart/${id}`)
        .then(res => {
          alert(res.data.message);
          getCart();
          status.value.addCartLoading = false;
        })
        .catch(err => {
          alert(err.data.message);
          status.value.addCartLoading = false;
        });
    };

    // 調整數量
    const changeNum = (cartID, qty) => {
      const data = {
        product_id: cartID.product_id,
        qty,
      };
      axios.put(`${url}/v2/api/${apiPath}/cart/${cartID.id}`, { data })
        .then(() => getCart())
        .catch(err => alert(err.data.message));
    };

    // Loading 狀態
    const status = ref({
      addCartLoading: false,
    })

    // 結帳資訊
    const data = ref({
      user: {
        name: '',
        email: '',
        tel: '',
        address: '',
      },
      message: '',
    });
    const onSubmit = () => {
      axios.post(`${url}/v2/api/${apiPath}/order`, { data: data.value })
        .then(res => {
          alert(res.data.message);
          data.value = {
            user: {
              name: '',
              email: '',
              tel: '',
              address: '',
            },
            message: '',
          };
          getCart();
        })
        .catch(err => alert(err.data.message));
    };

    return {
      products,
      modalRef,
      tempProduct,
      cart,
      status,
      data,
      getProduct,
      addToCart,
      delCartList,
      delCartItem,
      changeNum,
      onSubmit,
    }
  }
});
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');