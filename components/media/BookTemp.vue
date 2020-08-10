<template>
  <div id="book" v-on:click="selectBook">
    <div class="img">
      <div class="download" @click="erase">
        <i class="material-icons">
          delete
        </i>
      </div>
      <img :src="getBookWithImage" />
    </div>
    <div class="title">
      {{ book.title }}
    </div>
    <div class="subtitle">
      {{ book.author }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      description: "Descripción por defecto, quizá demasiado corta",
      imageSrc:
        "http://localhost:3003/" + this.book.sha1 + "." + this.book.imageFormat,
      downloads: [
        { type: "PDF", url: "#" },
        { type: "EPUB", url: "#" },
        { type: "GBA", url: "#" }
      ],
      languages: {
        es: { variant: "danger", name: "Español" },
        en: { variant: "warning", name: "Inglés" }
      },
      statuses: ["pending", "accepted", "denied", "erased"],
      selected: this.status,
      librosString: ['libro1.png', 'libro2.png', 'libro3.png', 'libro4.png'],
      options: [
        { item: "pending", text: "Status: pending" },
        { item: "accepted", text: "Status: accepted" },
        { item: "denied", text: "Status: denied" },
        { item: "erased", text: "Status: erased" }
      ]
    };
  },
  computed: {
    getBookWithImage() {
      if(this.book.imageFormat == '')
        return 'http://localhost:3003/'+this.librosString[Math.floor(Math.random() * this.librosString.length)]
        
      return 'http://localhost:3003/'+this.book.sha1+'.'+this.book.imageFormat
    },
    getTag() {
      return this.book.languages[this.language];
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
      return moment(String(this.book.uploadDate)).format("MM/DD/YYYY hh:mm");
    }
  },
  props: {
    id: String,
    book: Object
  },

  methods: {
    selectBook(e) {
      if (
        !(
          [...e.target.classList].includes("download") ||
          [...e.target.classList].includes("material-icons")
        )
      ) {
        this.$emit("selectBook", this.book);
      }
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
    erase() {
      const url = `http://localhost:3003/book/` + this.book._id;
      const localthis = this
      axios({
        url: url,
        method: "DELETE"
      })
        .then(response => {
          console.log(response);
          localthis.location.reload()
          return false
        })
        .catch(err => {
          console.log(err);
          console.log("FAILURE!!");
        });
    }
  }
};
</script>

<style scoped>
.pxmargin {
  margin-right: 2px;
}

#book {
  display: flex;
  flex-direction: column;
  width: fit-content;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  width: 220px;
}

#book:hover img {
  width: 172px;
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.116),
    0 3px 6px rgba(0, 0, 0, 0.09);
  height: calc(172px * 1.35);
}

#book:hover .title {
  font-size: 18.5px;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.09);
}

#book:hover .subtitle {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.09);
  font-size: 13.5px;
}

#book .img {
  position: relative;
  width: fit-content;
}

#book .img .download {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0;
  transform: translate(50%, -50%);
  background: #FF0000;
  color: var(--main-color-alt-fg);
  border-radius: 50%;
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.05);
  height: 50px;
  width: 50px;
  cursor: pointer;
  transition: all ease-in-out 0.325s;
}

#book .img .download:hover {
  height: 55px;
  width: 55px;
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.116),
    0 3px 6px rgba(0, 0, 0, 0.09);
}

.download:hover > i {
  animation: down-vibrate ease-in-out 0.5s 2;
  font-size: 35px !important;
}

@keyframes down-vibrate {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(2.5px);
  }
  100% {
    transform: translateY(0px);
  }
}

#book .img .download i {
  font-size: 30px;
  transition: all ease-in-out 0.325s;
}

#book img {
  width: 170px;
  height: calc(170px * 1.35);
  object-fit: cover;
  object-position: center center;
  border-radius: 7.5px;
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03),
    0 3px 6px rgba(214, 161, 161, 0.05);
  transition: all ease-in-out 0.325s;
}

#book > .title {
  margin-top: 15px;
  text-align: center;
  font-size: 18px;
  letter-spacing: 0.75px;
  line-height: 20px;
  margin-bottom: 2.5px;
  transition: all ease-in-out 0.325s;
  text-shadow: 0 1.5px 3px rgba(214, 161, 161, 0.05);
  color: var(--foreground-color-main);
}

#book > .subtitle {
  color: var(--foreground-color-main);
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.4px;
  line-height: 15px;
  opacity: 0.7;
  text-transform: uppercase;
  transition: all ease-in-out 0.325s;
  text-shadow: 0 1px 2px rgba(214, 161, 161, 0.05);
}

@media screen and (max-width: 768px) {
  .download {
    display: none !important;
  }
  #book {
    width: 125px;
  }
  #book img {
    width: 125px;
    height: calc(125px * 1.35);
  }
  #book > .title {
    font-size: 14px;
    line-height: 16px;
  }
  #book:hover .title {
    font-size: 14.5px;
    text-shadow: 0 2px 3px rgba(0, 0, 0, 0.09);
  }

  #book:hover .subtitle {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.09);
    font-size: 10.5px;
  }

  #book > .subtitle {
    font-size: 10px;
    line-height: 12px;
  }
  #book:hover img {
    width: 135px;
    height: calc(135px * 1.35);
  }
}
</style>
