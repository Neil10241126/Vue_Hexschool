// Composition API
import { url, apiPath } from '../js/env.js';
import { createApp, ref, onMounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.5/vue.esm-browser.min.js';
import pagination from '../components/pagination.js';
import productModal from '../components/productModal.js';
import delProductModal from '../components/delProductModal.js';

const app = createApp({
  components: {
    pagination,
    productModal,
  },
  setup() {
    const products = ref([]);
    const tempProduct = ref({
      imagesUrl: []
    });
    const pagination = ref({});
    const isNew = ref(true);
    const file = ref({});
    const sizeCheck = ref(true);
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
    function getProducts(page = 1) {
      axios.get(`${url}/v2/api/${apiPath}/admin/products/?page=${page}`)
        .then(res =>  {
          products.value = res.data.products;
          pagination.value = res.data.pagination;
        })
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

    // 【檢查圖片】: 判斷引入圖片檔是否大於 3 MB。
    function uploadCheck(e) {
      file.value = e.target.files[0];
      // 取得檔案大小並轉換為 KB。
      const sizeKB = (e.target.files[0].size / 1024).toFixed(2);
      // 設定檔案最大為 3 MB 
      const maxFileSize = 3 * 1024;
      if (sizeKB >= maxFileSize ) {
        sizeCheck.value = true;
      } else {
        sizeCheck.value = false;
      }
      
    };

    // 【上傳圖片】
    function upload() {
      const formData = new FormData();
      formData.append('file-to-upload', file.value);

      axios.post(`${url}/v2/api/${apiPath}/admin/upload`, formData)
        .then(() => alert('圖片上傳成功'))
        .catch(err => alert(err.data.message));
    }

    // 【星級評等 1~5】:
    // 設定每個星級的屬性，唯一值 "id" 、是否切換顏色 "colorActive"。
    let starArray = ref([
      {
        id: 1,
        colorActive: false,
      },
      {
        id: 2,
        colorActive: false,
      },
      {
        id: 3,
        colorActive: false,
      },
      {
        id: 4,
        colorActive: false,
      },
      {
        id: 5,
        colorActive: false,
      }
    ]);

    // 【設定變色邏輯】: 依據點擊到的 id 來比對渲染數目。
    function active(num) {
      starArray.value.forEach((item, idx) => {
        if (item.id <= num) {
          starArray.value[idx].colorActive = true;
        } else {
          starArray.value[idx].colorActive = false;
        }
      });
      tempProduct.value.star = num;
    }

    // 【重置】: 回復星級預設值。
    function reset() {
      active(0);
    };


    return {
      products,
      tempProduct,
      pagination,
      isNew,
      sizeCheck,
      starArray,
      getProducts,
      openModal,
      updateProduct,
      delProduct,
      uploadCheck,
      upload,
      active,
      reset,
    }

  }
});
app.component('delProductModal', delProductModal);
app.mount('#app');