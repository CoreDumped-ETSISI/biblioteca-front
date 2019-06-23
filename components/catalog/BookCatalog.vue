<template>
<div id="book-test">
    <b-card-group columns>     
        <book v-for="n in 2"></book>
    </b-card-group>
    <div class="overflow-auto">
      <b-pagination-nav :link-gen="linkGen" :number-of-pages="10" use-router></b-pagination-nav>
    </div>
</div>
</template>

<script>
import book from '~/components/media/Book.vue'

export default {
  components: {
    book
  },
  methods: {
      linkGen(pageNum) {
        return pageNum === 1 ? '?' : `?page=${pageNum}`
      }
    }
}
</script>

<style scoped>
#book-test{
    border: black solid 2pt;
    margin: auto 0;
}
</style>