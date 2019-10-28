<template>
    <catalog></catalog>
</template>

<script>
import catalog from '~/components/catalog/SearchCatalog.vue'

export default {
  middleware: 'auth',
  components: {
    catalog
  }
}
</script>

<style scoped>
</style>