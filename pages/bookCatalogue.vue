<template>
    <catalog></catalog>
</template>

<script>
import catalog from '~/components/catalog/BookCatalog2.vue'

export default {
  middleware: 'auth',
  components: {
    catalog
  }
}
</script>

<style scoped>
</style>

