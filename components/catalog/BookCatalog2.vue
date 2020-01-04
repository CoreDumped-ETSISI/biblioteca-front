<template>
<div id="book-test">
    <b-card-group columns>     
        <book 
            v-for="post of posts" 
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
            :imageFormat=post.imageFormat>
        </book>
    </b-card-group>
    <div class="overflow-auto">
      <b-pagination-nav :link-gen="linkGen" :number-of-pages="10" use-router></b-pagination-nav>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import book from '~/components/media/Book2.vue'

export default {
  components: {
    book
  },
  methods: {
      linkGen(pageNum) {
        return pageNum === 1 ? '?' : `?page=${pageNum}`
      }
    },
    data() {
    return {
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
