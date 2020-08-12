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
          Libros recomendados
        </div>

        <div class="books" v-if="getFilteredBooks.length != 0">
          <book
            v-for="post in getFilteredBooks"
            v-on:selectBook="selectBook($event)"
            v-bind:key="post.id"
            :book="post"
          >
          </book>
        </div>
        <h2 v-else align="center">Descarga más libros para poder acceder a recomendaciones</h2>
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
  computed: {
    getFilteredBooks() {
        let localThis = this
      return this.posts.filter(function( obj ) {
        return !localThis.readId.includes(obj._id) &&
            (localThis.readPublisher.includes(obj.publisher) || localThis.readAuthor.includes(obj.author)
            || obj.tags.filter(value => localThis.readTag.includes(value)).length > 0);
    });
    }
  },
  props: ["search"],
  data() {
    return {
      posts: [],
      readId: [],
      readPublisher: [],
      readTag: [],
      readAuthor: [],
      filteredBooks: [],
      errors: [],
      selectedBook: undefined
    };
  },

  mounted() {
    let config = {
      headers: { Authorization: "Bearer " + localStorage.getItem("user-token") }
    };
    let localThis = this
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

    axios
      .get(`http://localhost:3003/user/getByName/`+localStorage.getItem("user-name"), config)
      .then(response => {
          console.log(response.data)
          const myid = response.data.user[0]._id;
          axios
            .get(`http://localhost:3003/download/getUserDownloads/`+myid, config)
            .then(response2 => {
                var x
                console.log(response2.data.downloads)
                for(x of response2.data.downloads) {
                    this.readId.push(x.book._id)
                    this.readPublisher.push(x.book.publisher)
                    this.readAuthor.push(x.book.author)
                    var y
                    for(y of x.book.tags) {
                        this.readTag.push(y)
                    }
                }
                console.log(this.readId)
                console.log(this.readPublisher)
                console.log(this.readAuthor)
                console.log(this.readTag)
            })
            .catch(e => {
                this.errors.push(e);
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
