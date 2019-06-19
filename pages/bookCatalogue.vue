<template>
  <div>
    <ul v-if="posts && posts.length">
        <li v-for="post of posts" v-bind:key="post.id">
					<p><strong>{{post.title}}</strong></p>
					<p>{{post.author}}</p>
					<p>{{post.pageNumber}}</p>
        </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      posts: [],
      errors: []
    }
  },

  created() {
    axios.get(`http://localhost:3003/book/getAllBooks`)
    .then(response => {
      this.posts = response.data.books
    })
    .catch(e => {
			this.errors.push(e)
    })
  }
}
</script>
