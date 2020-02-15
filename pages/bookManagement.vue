<template>
  <div>
      <topnavbar :logged=true></topnavbar>
      <catalog></catalog>
  </div>
</template>

<script>
import catalog from '~/components/catalog/SearchModify.vue'
import topnavbar from '../components/Navbar.vue'

export default {
  
  middleware: 'isAdmin',
  components: {
    catalog,
    topnavbar
  }
}
</script>

<style scoped>
</style>