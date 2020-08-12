<template>
  <div>
    <topnavbar :logged="true"></topnavbar>
    <catalog id="catalog"></catalog>
  </div>
</template>

<script>
import catalog from "~/components/catalog/RecommendationCatalogue.vue";
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
