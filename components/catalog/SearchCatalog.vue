<template>
<div>
  <div class="lowMargin">
    <div class="col-md-9 m-auto">
      <h1 class="text-center display-4 my-4">Busca un libro</h1>
      <multiselect 
        v-model="value" 
        tag-placeholder="Add this as new tag" 
        placeholder="Include search parameters" 
        :options="options" 
        :multiple="true" 
        :taggable="true" 
        @tag="addTag">
      </multiselect>
      <b-form-input v-model="text" placeholder="Enter your search terms"></b-form-input>
    </div>
  </div>
    <h2 class="text-center noResult" v-if="noResult">No hay ningun libro con esos parámetros</h2>
    <b-card-group columns>     
        <book 
            v-for="post of searchAllFields" 
            v-bind:key="post.id" 
            :title=post.title 
            :author=post.author 
            :synopsis=post.synopsis 
            :publisher=post.publisher 
            :size=post.size 
            :language=post.language
            :tags=post.tags
            :filename=post.filename 
            :format=post.format
            :sha1=post.sha1
            :imageFormat=post.imageFormat>
        </book>
    </b-card-group>
</div>
</template>

<script>
import axios from 'axios';
import book from '~/components/media/Book2.vue'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    book,
    Multiselect 
  },
  methods: {
      addTag () {
        this.options.push(tag)
        this.value.push(tag)
        console.log(this.value)
      },
      myData() {
        console.log(this.value)
      }
    },
    data() {
    return {
      posts: [],
      errors: [],
      text: '',
      selected: null,
      options: ['title', 'author', 'synopsis', 'publisher', 'tags'],
      value: [],
      noResult: false
    }
  },

  computed: {
    searchAllFields() {
      let localThis = this
      let categories = this.value
      if(categories.length == 0)
        categories = this.options

      this.noResult = true
      return this.posts.filter(function(post){
        var i
        for(i=0 ; i<categories.length ; i++){
          if(categories[i] === 'tags'){
            if(post[categories[i]].length > 0 && post[categories[i]].filter(s =>
             s.includes(localThis.text.toLowerCase())).length>0)
              return true
          }
          else if(post[categories[i]].toLowerCase().includes(localThis.text.toLowerCase())){
            localThis.noResult = false
            return true
          }
        }
        return false
      })
    }
  },

  mounted() {
    console.log(2)
    let config = { headers: { Authorization: 'Bearer '+this.$store.state.auth.token } }
    axios.get(`http://localhost:3003/book/getAllBooks`, config)
    .then(response => {
      this.posts = response.data.books
      this.posts = this.posts.filter(function(post){
        if(post.status === "accepted")
          return true
        return false
      })
      console.log(this.posts)
    })
    .catch(e => {
			this.errors.push(e)
    })
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
  .lowMargin {
    margin-bottom: 20px !important;
  }

  .noResult {
    margin-top: 50px;
    color: grey
  }
</style>
