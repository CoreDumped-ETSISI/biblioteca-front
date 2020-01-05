<template>
<div id="book-test">
    <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
      ></b-pagination>
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
      perPage: 1,
      currentPage: 1,
      posts: [],
      errors: []
    }
  },

  mounted() {
    let config = { headers: { Authorization: 'Bearer '+localStorage.getItem("user-token") } }
    axios.get(`http://localhost:3003/book/getAllBooks`, config)
    .then(response => {
      this.posts = response.data.books
    })
    .catch(e => {
			this.errors.push(e)
    })
  }
}
</script>
