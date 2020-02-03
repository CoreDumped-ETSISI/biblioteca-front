<template>
<div id="book-test">
  <div class="row lowMargin">
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
            v-for="post of currentPosts" 
            v-bind:key="post.id"
            :id=post._id
            :status=post.status
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
            :imageFormat=post.imageFormat
            :uploadDate=post.uploadDate>
        </book>
    </b-card-group>

    <b-pagination
      align="center"
      v-if="!noResult"
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
    ></b-pagination>
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
      options: ['title', 'author', 'synopsis', 'publisher', 'status'],
      value: [],
      noResult: false,
      perPage: 6,
      currentPage: 1
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
          if(post[categories[i]].toLowerCase().includes(localThis.text.toLowerCase())){
            localThis.noResult = false
            return true
          }
        }
        return false
      })
    },
    rows() {
        return this.searchAllFields.length
    },

    currentPosts() {
        console.log((this.currentPage-1)*this.perPage )
        console.log((this.currentPage-1)*this.perPage+this.perPage)
          return this.searchAllFields.slice((this.currentPage-1)*this.perPage, (this.currentPage-1)*this.perPage+this.perPage)
    }
  },

  mounted() {
    let config = { headers: { Authorization: 'Bearer '+localStorage.getItem("user-token") } }
    axios.get(`http://192.168.0.104:3003/book/getAllBooks`, config)
    .then(response => {
      this.posts = response.data.books.sort(function(a,b){
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      });
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
