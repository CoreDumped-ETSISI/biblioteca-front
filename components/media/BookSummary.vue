<template>
  <div class="book-open">
    <div class="close-summary" v-on:click="closeBook"></div>
    <div class="book-summary" v-bind:style="this.animation">
      <div class="book-summary-inner">
        <div class="book-cover">
          <img :src="getBookWithImage" />
          <div class="download">
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
        <div class="book-description">
          <div class="book-title">{{ book.title }}</div>
          <div class="info">
            <div class="author">{{ book.author }}</div>
            <div class="publisher">{{ book.publisher }}</div>
          </div>
          <hr>
          <div class="synopsis">{{ book.synopsis }}</div>
        </div>
        <div class="book-tags">
          <div class="tag" v-for="tag of book.tags" v-bind:key="tag">
            <div> {{ tag }} </div>
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
        animation: { transform: 'none' },
        description: "Descripción por defecto, quizá demasiado corta",
        imageSrc: "http://localhost:3003/" + this.sha1 + "." + this.imageFormat,
        downloads: [{
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
        options: [{
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
        ]
      };
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
    props: {
      book: Object
    },

    methods: {
      async closeBook() {
        this.animation = { transform: 'translateY(calc(100% + 300px))' };
        await this.delay(250);
        this.$emit("close", "close");
        this.animation = { transform: 'none' };
      },
      async delay(ms) {
        return new Promise(r => setTimeout(r, ms))
      },
      onChange() {
        console.log(this.selected);
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
          .catch(function (err) {
            console.log(err);
            console.log("FAILURE!!");
          });
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

  .book-open>.close-summary {
    height: 60vh;
    width: 100vw;
    cursor: pointer;
  }

  .book-open>.book-summary {
    height: 40vh;
    width: 100vw;
    background: white;
    transition: all .25s ease-in-out;
    animation: appear-in 0.25s ease-in-out;
    border-radius: 20px 20px 0 0;
    box-shadow: 0px 3px 6px 2px rgba(255, 255, 255, 0.03),
      0 3px 6px rgba(255, 255, 255, 0.05);
  }

  .book-open>.book-summary>.book-summary-inner {
    display: flex;
    justify-content: flex-start;
    padding: 50px 5vw;
  }

  .book-cover {
    display: flex;
    flex-direction: column;
    align-items: space-between;
    transform: translateY(calc(-50% - 50px));
    max-width: 270px;
    align-items: center;
  }

  .book-cover img {
    margin-bottom: 25px;
    width: 270px;
    height: auto;
    border-radius: 10px;
    box-shadow: 30px 30px 80px rgba(55, 84, 170, 0.1),
      -30px -30px 80px rgba(255, 255, 255, 1),
      inset 4px 4px 20px rgba(255, 255, 255, 0.5);
  }

  .book-cover>.info {
    opacity: 0.75;
    display: flex;
    flex-direction: column;
    font-size: 14px;
  }

  .book-cover>.info>div {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .book-cover>.info>div>div {
    text-overflow: ellipsis;
  }

  .book-cover>.info>div>i {
    margin-right: 10px;
    font-size: 24px;
  }

  .book-cover .download {
    margin-bottom: 15px;
    width: min-content;
    padding: 0 20px;
    color: #0d860f;
    font-weight: bold;
    border: 2px solid #0d860f;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    transition: all 0.25s ease-in-out;
    cursor: pointer;
  }

  .book-cover .download:hover {
    background: #0d860f;
    color: white;
  }

  .book-cover .download i {
    margin-right: 10px;
  }

  .book-description {
    margin-left: 50px;
  }

  .book-description>.book-title {
    font-size: 28px;
  }

  .book-description>.info {
    display: flex;
    opacity: .85;
  }

  .book-description>.info>div:first-child {
    margin-right: 10px;
  }

  .book-description>.info>div:first-child::before {
    display: inline;
    content: 'Autor: ';
    font-weight: bold;
    font-size: 13px;
    text-transform: uppercase;
  }

  .book-description>.info>div:last-child::before {
    display: inline;
    content: '· Editorial: ';
    font-weight: bold;
    font-size: 13px;
    text-transform: uppercase;
  }

  .book-description>.synopsis {
    width: 40vw;
    margin-top: 20px;
  }

  .book-description>.synopsis::before {
    content: 'Sinopsis: ';
    display: inline;
    font-size: 13px;
    font-weight: bold;
  }

  .book-tags {
    margin-left: 20px;
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
  }

  .book-tags>.tags {
    font-size: 18px;
  }

  .book-tags>.tag {
    background: #0d860f;
    color: white;
    border-radius: 2px;
    margin: 0 2.5px 10px;
    padding: 12px 15px;
    font-size: 13px;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .book-tags>.tag i {
    margin-left: 10px;
    font-size: 14px;
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

</style>
