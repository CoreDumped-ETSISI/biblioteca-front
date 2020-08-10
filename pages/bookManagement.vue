<template>
  <div>
      <topnavbar @onSearch="onSearch" :logged=true></topnavbar>
    <catalog :search="this.search" id="catalog"></catalog>
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
}
</script>

<style scoped>
</style>