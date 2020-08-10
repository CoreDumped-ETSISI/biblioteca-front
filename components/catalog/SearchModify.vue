<template>
  <section>
    <bookSummary
      v-if="selectedBook !== undefined"
      v-bind:selectedBook="selectedBook"
      v-on:close="selectBook($event)"
      @changeBook="changeBook"
    ></bookSummary>
    <div id="library">
      <div class="lowMargin">
        <div class="title">
          Catálogo de libros
        </div>

        <div class="books">
          <book
            v-for="post in search.query.length === 0 ? posts : filteredBooks"
            v-on:selectBook="selectBook($event)"
            v-bind:key="post.id"
            :book="post"
          >
          </book>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import book from "~/components/media/BookTemp.vue";
import bookSummary from "~/components/media/BookSummary.vue";

export default {
  components: {
    book,
    bookSummary
  },
  methods: {
    changeBook(e) {
      const i = this.posts.map(el => el._id).indexOf(e.book._id);
      if (e.next) {
        if (i + 1 < this.posts.length) {
          this.selectBook(this.posts[i + 1], i + 1);
        }
      } else {
        if (i > 0) {
          this.selectBook(this.posts[i - 1], i - 1);
        }
      }
    },
    selectBook(
      book,
      i = book === "close" ? -1 : this.posts.map(el => el._id).indexOf(book._id)
    ) {
      const len = this.posts.length;
      if (book !== "close") {
        this.selectedBook = { book, i, len };
      } else {
        this.selectedBook = undefined;
      }
    },
    intersection: (arrayA, arrayB) => arrayA.filter(el => arrayB.includes(el))
  },
  watch: {
    search: function() {
      if (this.search.query !== "") {
        this.filteredBooks = this.posts.filter(book => {
          if (this.search.params.every(el => !el.active)) {
            this.search.params[0].active = true;
          }
          for (const param of this.search.params) {
            if (param.key !== "tags") {
              if (
                param.active &&
                book[param.key]
                  .toLowerCase()
                  .includes(this.search.query.toLowerCase())
              ) {
                return true;
              }
            } else {
              if (
                this.intersection(
                  book.tags.map(el => (el = el.toLowerCase())),
                  this.search.query
                    .split(/[\s,]/g)
                    .map(el => (el = el.toLowerCase()))
                ).length > 0
              ) {
                return true;
              }
            }
          }
          return false;
        });
      } else {
        this.filteredBooks = this.posts;
      }
    }
  },
  props: ["search"],
  data() {
    return {
      posts: [],
      filteredBooks: [],
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

<style scoped>
section {
  width: 100%;
  min-height: calc(100vh - 68px);
  background: var(--bg-color-2);
  padding-top: 30px;
  display: flex;
  justify-content: flex-end;
  padding: 0 5vw;
}
.title {
  color: var(--foreground-color-main);
  font-size: 24px;
  opacity: 0.9;
  display: block;
  margin: 60px 0;
}
#library {
  width: 90vw;
}

.books {
  display: grid;
  grid-template-columns: repeat(auto-fill, 220px);
  grid-gap: 50px;
  justify-content: center;
}

@media screen and (max-width: 768px) {
  .books {
    grid-template-columns: repeat(auto-fill, 125px);
  }
  .title {
    margin: 30px 0;
  }
}
</style>
