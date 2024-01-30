export default {
  props: ['pagination', 'getProducts'],
  template: /*html*/`<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item"
        :class="{'disabled': pagination.has_pre === false}">
        <a class="page-link" href="#" aria-label="Previous"
          @click.prevent="getProducts(pagination.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li class="page-item"
        :class="{'active': pagination.current_page === page}"
        v-for="page in pagination.total_pages" :key="page + 123">
        <a class="page-link" href="#"
          @click.prevent="getProducts(page)">{{ page }}</a>
      </li>

      <li class="page-item"
        :class="{'disabled': pagination.has_next === false}">
        <a class="page-link" href="#" aria-label="Next"
          @click.prevent="getProducts(pagination.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`
}