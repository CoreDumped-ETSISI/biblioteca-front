<template>
  <div>
    <topnavbar @onSearch="onSearch" :logged="true"></topnavbar>
    <catalog :search="this.search" id="catalog"></catalog>
  </div>
</template>

<script>
import catalog from "~/components/catalog/BookCatalog2.vue";
import topnavbar from "../components/Navbar.vue";

export default {
  middleware: "auth",
  components: {
    topnavbar,
    catalog
  },
  data() {
    return {
      search: {
        query: '',
        params: []
      }
    }
  },
  methods: {
    onSearch(data) {
      this.search = data; 
    }
  }
};
</script>

<style scoped>
@media screen and (min-width: 768px) {
  #catalog {
    margin-top: 68px;
  }
}
@media screen and (max-width: 768px) {
  #catalog {
    margin-bottom: 68px;
  }
}
</style>
