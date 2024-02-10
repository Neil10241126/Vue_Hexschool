const { ref, onMounted, watch } = Vue;

export default {
  props: ['tempProduct', 'addToCart', 'status'],
  template: '#userProductModal',
  setup(props) {
    // 註冊 Modal 實體
    const bsModal = ref(null);
    const modal = ref(null);

    const openModal = () => {
      modal.value.show();
    };
    const closeModal = () => {
      modal.value.hide();
    };
    onMounted(() => {
      modal.value = new bootstrap.Modal(bsModal.value); 
    })

     // 加入購物車
     const qty = ref(1);
     watch(() => props.tempProduct, () => {
      qty.value = 1;
    });
     

    return {
      bsModal,
      qty,
      openModal,
      closeModal,
    }
  }
}