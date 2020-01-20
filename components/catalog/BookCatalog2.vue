<template>
  <section>
    <bookSummary v-if="selectedBook !== undefined" v-bind:book="selectedBook" v-on:close="selectBook($event)"></bookSummary>
    <div id="library">
      <div class="lowMargin">
        <div class="title">
          Catálogo de libros
        </div>

        <div class="books">
          <book
            v-for="post of currentPosts"
            v-on:selectBook="selectBook($event)"
            v-bind:key="post.id"
            :book="post"
          >
          </book>
        </div>

        <b-pagination
          align="center"
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
        ></b-pagination>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import book from "~/components/media/Book2.vue";
import bookSummary from "~/components/media/BookSummary.vue";

export default {
  components: {
    book,
    bookSummary
  },
  computed: {
    rows() {
      return this.posts.length;
    },
    currentPosts() {
      console.log((this.currentPage - 1) * this.perPage);
      console.log((this.currentPage - 1) * this.perPage + this.perPage);
      return this.posts.slice(
        (this.currentPage - 1) * this.perPage,
        (this.currentPage - 1) * this.perPage + this.perPage
      );
    }
  },
  methods: {
    selectBook(book) {
      if(book !== 'close') {
        console.log(book);
        this.selectedBook = book; 
      } else {
        this.selectedBook = undefined;  
      }
    }
  },

  data() {
    return {
      perPage: 6,
      currentPage: 1,
      posts: [],
      errors: [],
      selectedBook: undefined
    };
  },

  mounted() {
    let config = {
      headers: { Authorization: "Bearer " + localStorage.getItem("user-token") }
    };
    axios
      .get(`http://localhost:3003/book/getAllBooks`, config)
      .then(response => {
        this.posts = response.data.books.sort(function(a, b) {
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        });
      })
      .catch(e => {
        this.errors.push(e);
      });
  }
};
</script>

<style>
section {
  width: 100%;
  min-height: calc(100vh - 68px);
  background: #fafafa;
  padding-top: 30px;
  display: flex;
  justify-content: flex-end;
  padding: 0 5vw;
}
.title {
  font-size: 24px;
  opacity: 0.9;
  display: block;
  margin: 60px 0;
}
#library {
  width: 70vw;
}

.books {
  display: grid;
  grid-template-columns: repeat(auto-fill, 220px);
  grid-gap: 50px;
}
</style>
