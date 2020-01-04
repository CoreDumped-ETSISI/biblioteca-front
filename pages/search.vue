<template>
    <catalog v-if="accessible"></catalog>
</template>

<script>
import catalog from '~/components/catalog/SearchCatalog.vue'

export default {
  data() {
    return {
      accessible : false
    }
  },
  components: {
    catalog
  }, 
   methods: {
      changePage(){
        this.$router.push({
            path: '/login'
        })
      }
  },
  mounted() {
    if(localStorage.getItem("user-token") == null)
      this.changePage()
    else
      this.accessible = true
  }
}
</script>

<style scoped>
</style>