<template>
<div class="lowMargin">
    <div class="col-md-9 m-auto">
      <h1 class="text-center display-4 my-4">Catálogo de libros</h1>
</div>
    <b-card-group 
      columns>     
        <book 
            v-for="post of currentPosts" 
            v-bind:key="post.id" 
            :title=post.title 
            :author=post.author 
            :synopsis=post.synopsis 
            :category=post.category 
            :publisher=post.publisher 
            :pageNumber=post.pageNumber 
            :size=post.size 
            :tags=post.tags
            :filename=post.filename 
            :format=post.format 
            :sha1=post.sha1 
            :language=post.language
            :imageFormat=post.imageFormat
            :uploadDate=post.uploadDate>
        </book>
    </b-card-group>

    <b-pagination
      align="center"
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
    ></b-pagination>
</div>
</template>

<script>
import axios from 'axios';
import book from '~/components/media/Book2.vue'

export default {
  components: {
    book
  },
  computed: {
      rows() {
        return this.posts.length
      },
      currentPosts() {
        console.log((this.currentPage-1)*this.perPage )
        console.log((this.currentPage-1)*this.perPage+this.perPage)
          return this.posts.slice((this.currentPage-1)*this.perPage, (this.currentPage-1)*this.perPage+this.perPage)
      }
  },
 
    data() {
    return {
      perPage: 6,
      currentPage: 1,
      posts: [],
      errors: []
    }
  },

  mounted() {
    let config = { headers: { Authorization: 'Bearer '+localStorage.getItem("user-token") } }
    axios.get(`http://localhost:3003/book/getAllBooks`, config)
    .then(response => {
      this.posts = response.data.books.sort(function(a,b){
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      });
    })
    .catch(e => {
			this.errors.push(e)
    })
  }
}
</script>

<style>
  .lowMargin {
    margin-bottom: 20px !important;
  }
</style>

