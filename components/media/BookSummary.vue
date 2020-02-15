<template>
  <div class="book-open">
    <div class="close-summary" v-on:click="closeBook"></div>
    <div
      id="book-summary"
      class="book-summary"
      v-bind:style="{ transform: this.animation.transform }"
    >
      <div class="book-summary-inner" v-bind:style="this.animationX">
        <div class="book-cover">
          <img :src="getBookWithImage" />
          <div class="book-info">
            <div class="download" @click="download">
              <i class="material-icons">cloud_download</i> Descargar
            </div>
            <div class="info">
              <div>
                <i class="material-icons">sd_storage</i>
                <div><b>Tamaño:</b> {{ getUnits }}</div>
              </div>
              <div>
                <i class="material-icons">language</i>
                <div><b>Idioma:</b> {{ getTag.name }}</div>
              </div>
              <div>
                <i class="material-icons">access_time</i>
                <div><b>Fecha de subida:</b> {{ getDate }}</div>
              </div>
              <div>
                <i class="material-icons">attachment</i>
                <div><b>Formato:</b> {{ book.format }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="book-description">
          <div class="book-title">{{ book.title }}</div>
          <div class="info">
            <div class="author">{{ book.author }}</div>
            <div class="publisher">{{ book.publisher }}</div>
          </div>
          <hr />
          <p class="synopsis">{{ book.synopsis }}</p>
        </div>
        <div class="book-tags">
          <div class="tag" v-for="tag of book.tags" v-bind:key="tag">
            <div>{{ tag }}</div>
            <i class="material-icons">
              search
            </i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      book: this.selectedBook.book,
      animation: { transform: "none" },
      animationX: { transform: "none" },
      description: "Descripción por defecto, quizá demasiado corta",
      imageSrc: "http://localhost:3003/" + this.sha1 + "." + this.imageFormat,
      downloads: [
        {
          type: "PDF",
          url: "#"
        },
        {
          type: "EPUB",
          url: "#"
        },
        {
          type: "GBA",
          url: "#"
        }
      ],
      languages: {
        es: {
          variant: "danger",
          name: "Español"
        },
        en: {
          variant: "warning",
          name: "Inglés"
        }
      },
      statuses: ["pending", "accepted", "denied", "erased"],
      selected: this.status,
      options: [
        {
          item: "pending",
          text: "Status: pending"
        },
        {
          item: "accepted",
          text: "Status: accepted"
        },
        {
          item: "denied",
          text: "Status: denied"
        },
        {
          item: "erased",
          text: "Status: erased"
        }
      ],
      touchXi: 0,
      touchYi: 0,
      touchXf: 0,
      touchYf: 0,
      gestureContainer: {}
    };
  },
  mounted() {
    this.listenContainerGesture();
  },
  watch: {
    selectedBook: function() {
      this.book = this.selectedBook.book;
    }
  },
  computed: {
    getBookWithImage() {
      return (
        "http://localhost:3003/" + this.book.sha1 + "." + this.book.imageFormat
      );
    },
    getTag() {
      return this.languages[this.book.language];
    },
    getUnits() {
      var bytes = this.book.size;
      var decimals = 2;
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    getDate() {
      moment.locale("es");
      return moment(String(this.book.uploadDate)).format("DD/MM/YYYY hh:mm");
    }
  },
  props: ["selectedBook"],
  methods: {
    download() {
      const url = `http://localhost:3003/book/download/${this.book.filename}`;
      axios({
        url: url,
        method: "GET",
        responseType: "blob" // important
      })
        .then(response => {
          console.log(response);
          const url2 = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url2;
          link.setAttribute(
            "download",
            `${this.book.title}-${this.book.author}.${this.book.format}`
          ); //or any other extension
          document.body.appendChild(link);
          link.click();
        })
        .catch(err => {
          console.log(err);
          console.log("FAILURE!!");
        });
    },
    async listenContainerGesture() {
      await this.delay(150);
      this.gestureContainer = document.getElementById("book-summary");
      this.gestureContainer.addEventListener(
        "touchstart",
        e => {
          this.touchXi = e.targetTouches[0].screenX;
          this.touchXf = this.touchXi;
          this.touchYi = e.targetTouches[0].screenY;
        },
        false
      );

      this.gestureContainer.addEventListener(
        "touchmove",
        async e => {
          this.touchYf = e.changedTouches[0].screenY;
          await this.handleGesture(true);
        },
        false
      );

      this.gestureContainer.addEventListener(
        "touchend",
        async e => {
          this.touchXf = e.changedTouches[0].screenX;
          await this.handleGesture(false);
        },
        false
      );
    },
    async closeBook(mobile = false) {
      if (mobile) {
        this.animation = { transform: "translateY(100%)" };
      } else {
        this.animation = { transform: "translateY(calc(100% + 300px))" };
      }
      await this.delay(350);
      this.$emit("close", "close");
      this.animation = { transform: "none" };
    },
    async delay(ms) {
      return new Promise(r => setTimeout(r, ms));
    },
    onChange() {
      axios
        .put(`http://localhost:3003/book/` + this.id, {
          status: this.selected
        })
        .then(response => {
          console.log(response);
        })
        .catch(e => {
          this.errors.push(e);
          console.log("error");
        });
    },
    download() {
      let url = "http://localhost:3003/book/download/" + this.book.filename;
      axios({
        url: url,
        method: "GET",
        responseType: "blob" // important
      })
        .then(response => {
          console.log(response);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            this.book.title + "-" + this.book.author + "." + this.book.format
          ); //or any other extension
          document.body.appendChild(link);
          link.click();
        })
        .catch(function(err) {
          console.log(err);
          console.log("FAILURE!!");
        });
    },
    async handleGesture(posY) {
      if (
        posY &&
        (Math.abs(this.touchXi - this.touchXf) <
          Math.abs(this.touchYi - this.touchYf) ||
          Math.abs(this.touchYi - this.touchYf) > 100)
      ) {
        if (this.touchYf > this.touchYi) {
          const distance = this.touchYf - this.touchYi;
          if (distance > 100) {
            this.closeBook(true);
          } else {
            this.animation = { transform: `translateY(${distance}px)` };
            await this.delay(350);
            this.animation = { transform: `none` };
          }
        }
      } else if (!posY) {
        if (Math.abs(this.touchXi - this.touchXf) > 90) {
          if (
            this.touchXf < this.touchXi &&
            this.selectedBook.i < this.selectedBook.len - 1
          ) {
            this.animationX = {
              transform: `translate(-100%, 0)`,
              opacity: 0.1
            };
            this.animation = {
              transform: "translate(0)"
            };
            await this.delay(175);
            this.$emit("changeBook", { book: this.book, next: true });
            this.animationX = {
              transition: "unset",
              transform: `translate(100%, 0)`
            };
            await this.delay(25);
            this.animationX = {
              transform: `translate(93%, 0)`,
              opacity: 1
            };
            await this.delay(100);
            this.animationX = {};
          } else if (this.selectedBook.i > 0 && this.touchXf > this.touchXi) {
            this.animationX = {
              transform: `translate(100%, 0)`,
              opacity: 0.1
            };
            this.animation = {
              transform: "translate(0)"
            };
            await this.delay(175);
            this.$emit("changeBook", { book: this.book, next: false });
            this.animationX = {
              transition: "unset",
              transform: `translate(-100%, 0)`
            };
            await this.delay(25);
            this.animationX = {
              transform: `translate(-93%, 0)`,
              opacity: 1
            };
            await this.delay(100);
            this.animationX = {};
          }
        } else {
          this.animationX = {
            transform: `translate(${this.touchXf - this.touchXi}px, 0)`
          };
          await this.delay(350);
          this.animationX = { transform: `none` };
        }
        this.touchXf = 0;
        this.touchXi = 0;
      }
    }
  }
};
</script>

<style scoped>
.book-open {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background: radial-gradient(#0000001d, #00000020);
}

.book-open > .close-summary {
  height: 25vh;
  width: 100vw;
  cursor: pointer;
}

.book-open > .book-summary {
  height: 75vh;
  width: 100vw;
  background: var(--bg-color-1);

  transition: all 0.35s ease-in-out;
  animation: appear-in 0.25s ease-in-out;
  border-radius: 20px 20px 0 0;
  box-shadow: 0px 3px 6px 2px rgba(255, 255, 255, 0.03),
    0 3px 6px rgba(255, 255, 255, 0.05);
}

.book-open > .book-summary > .book-summary-inner {
  display: flex;
  justify-content: flex-start;
  padding: 50px 5vw;
  transition: all 0.35s ease-in-out;
}

.book-cover {
  display: flex;
  flex-direction: column;
  align-items: space-between;
  max-width: 270px;
  align-items: center;
}

.book-cover > .book-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.book-cover img {
  margin-bottom: 25px;
  width: 270px;
  height: auto;
  border-radius: 10px;
  box-shadow: var(--shadow-book);
}

.book-cover > .book-info > .info {
  opacity: 0.75;
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.book-cover > .book-info > .info > div {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  color: var(--foreground-color-main);
}

.book-cover > .book-info > .info > div > div {
  text-overflow: ellipsis;
}

.book-cover > .book-info > .info > div > i {
  margin-right: 10px;
  font-size: 24px;
  color: var(--foreground-color-main);
}

.book-cover .download {
  margin-bottom: 15px;
  width: min-content;
  padding: 0 20px;
  color: var(--foreground-color-main);
  font-weight: bold;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  transition: all 0.25s ease-in-out;
  cursor: pointer;
  box-shadow: var(--shadow-btn-main);
  transition: transform 0.35s ease-in-out, box-shadow 0.35s ease-in-out;
  background: var(--bg-btn-1);
}

.book-cover .download:hover {
  transform: translateY(1px);
}

.book-cover .download:active {
  transform: translateY(3px);
  box-shadow: var(--shadow-btn-main--hover);
}

.book-cover .download i {
  margin-right: 10px;
}

.book-description {
  margin-left: 50px;
}

.book-description > .book-title {
  font-size: 28px;
  color: var(--foreground-color-main);
}

.book-description > .info {
  display: flex;
  opacity: 0.85;
  color: var(--foreground-color-main);
}

.book-description > .info > div:first-child {
  margin-right: 10px;
}

.book-description > .info > div:first-child::before {
  display: inline;
  content: "Autor: ";
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
}

.book-description > .info > div:last-child::before {
  display: inline;
  content: "· Editorial: ";
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
}

.book-description > .synopsis {
  width: 45vw;
  max-height: 52.5vh;
  overflow-y: auto;
  margin-top: 20px;
  color: var(--foreground-color-main);
  padding-right: 20px;
  text-align: justify;
}

.book-description > .synopsis::before {
  content: "Sinopsis: ";
  display: inline;
  font-size: 13px;
  font-weight: bold;
}

.synopsis::-webkit-scrollbar {
  width: 4px;
}
.synopsis::-webkit-scrollbar-track {
  background: var(--bg-color-input-search);
  border-radius: 10px;
}
.synopsis::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}
.synopsis::-webkit-scrollbar-thumb:hover {
  background: var(--foreground-color-alt-transparent);
}

.book-tags {
  margin-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
}

.book-tags > .tags {
  font-size: 18px;
}

.book-tags > .tag {
  background: var(--bg-color-tag);
  color: var(--foreground-color-main);
  margin: 0 2.5px 10px;
  padding: 12px 15px;
  font-size: 13px;
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-tag);
  border-radius: 5px;
}

.book-tags > .tag i {
  margin-left: 10px;
  font-size: 14px;
}

.book-tags > .tag > div {
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes appear-in {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0%);
  }
}

@keyframes appear-out {
  from {
    transform: translateY(0%);
  }

  to {
    transform: translateY(100%);
  }
}

@media screen and (max-width: 768px) {
  body {
    overscroll-behavior-y: contain;
    overflow: none;
    touch-action: none;
  }
  .book-open {
    overscroll-behavior-y: contain;
  }
  .close-summary {
    display: none;
  }
  .book-summary {
    height: 100% !important;
    overflow: auto;
    overscroll-behavior: contain;
    overscroll-behavior-y: contain;
    touch-action: none;
  }
  .book-summary > .book-summary-inner {
    height: 100%;
    flex-direction: column;
  }
  .book-cover {
    flex-direction: row;
    transform: unset;
    max-width: 100%;
  }
  .book-cover img {
    width: 150px;
    margin: 0 15px 15px 0;
  }
  .book-cover .book-info {
    flex-direction: column-reverse;
  }
  .download {
    margin: 15px 0;
  }
  .info b {
    display: none;
  }
  .book-description {
    margin: 10px 0;
  }
  .book-description > .book-title {
    font-size: 24px;
  }
  .book-description > .info {
    font-size: 14px;
  }
  .book-description > .synopsis {
    width: 100%;
  }

  .book-tags {
    margin: 25px 0 88px;
  }
}
</style>
