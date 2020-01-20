<template>
  <div>
    <topnavbar :logged="true"></topnavbar>
    <catalog id="catalog"></catalog>
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
  }
};
</script>

<style scoped>
  #catalog {
    margin-top: 68px;
  }
  
</style>
