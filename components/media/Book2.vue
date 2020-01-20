<template>
  <!--
  <b-card no-body class="overflow-hidden" style="max-width: 540px;">
    <b-row no-gutters>
      <b-col md="5">
        <b-card-img :src=getBookWithImage class="rounded-0"></b-card-img>
        <b-button class="topmargin" variant="success" v-on:click="download()">Descarga</b-button>
        <b-form-select
            v-if="status"
            v-model="selected"
            :options="options"
            value-field="item"
            text-field="text"
            disabled-field="notEnabled"
						v-on:change="onChange"
        ></b-form-select>
      </b-col>
      <b-col md="7">
        <b-card-body :title="title" :sub-title="author">
        <b-badge 
          v-for="badge in tags"
          v-bind:key="badge"
          variant="success">{{badge}}
        </b-badge>
        <b-card-text class="limitLines">
          {{ this.synopsis }}
        </b-card-text>
        <b-list-group flush>
          <b-list-group-item><strong>Editorial: </strong>{{ publisher }}</b-list-group-item>
          <b-list-group-item><strong>Tamaño: </strong>{{ getUnits }}</b-list-group-item>
          <b-list-group-item><strong>Idioma: </strong>
            <b-badge :variant=getTag.variant>{{getTag.name}}</b-badge>
          </b-list-group-item>
          <b-list-group-item><em>{{ getDate }}</em></b-list-group-item>
        </b-list-group>

        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
  -->
  <div id="book" v-on:click="selectBook">
    <div class="img">
      <div class="download">
        <i class="material-icons">
          cloud_download
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
      imageSrc: "http://localhost:3003/" + this.book.sha1 + "." + this.book.imageFormat,
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
      return "http://localhost:3003/" + this.book.sha1 + "." + this.book.imageFormat;
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
    selectBook: function() {
      this.$emit('selectBook', this.book);
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
        .catch(function(err) {
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
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.116), 0 3px 6px rgba(0,0,0,0.09);
  height: calc(172px * 1.35);
}

#book:hover .title {
  font-size: 18.5px;
  text-shadow: 0 2px 3px rgba(0,0,0,0.09);
}

#book:hover .subtitle {
  text-shadow: 0 1px 2px rgba(0,0,0,0.09);
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
  background: #0d860f;
  color: white;
  border-radius: 50%;
  box-shadow: 0px 3px 6px 2px rgba(0,0,0,0.03), 0 3px 6px rgba(0,0,0,0.05);
  height: 50px;
  width: 50px;
  cursor: pointer;
  transition: all ease-in-out .325s;
}

#book .img .download:hover {
  height: 55px;
  width: 55px;
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.116), 0 3px 6px rgba(0,0,0,0.09);
}

.download:hover > i {
  animation: down-vibrate ease-in-out .5s 2;
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
  transition: all ease-in-out .325s;
}

#book img {
  width: 170px;
  height: calc(170px * 1.35);
  object-fit: cover;
  object-position: center center;
  border-radius: 7.5px;
  box-shadow: 0px 3px 6px 2px rgba(0,0,0,0.03), 0 3px 6px rgba(214, 161, 161, 0.05);
  transition: all ease-in-out .325s;
}

#book > .title {
  margin-top: 15px;
  text-align: center;
  font-size: 18px;
  letter-spacing: 0.75px;
  line-height: 20px;
  margin-bottom: 2.5px;
  transition: all ease-in-out .325s;
  text-shadow: 0 1.5px 3px rgba(214, 161, 161, 0.05);
}

#book > .subtitle {
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.4px;
  line-height: 15px;
  opacity: 0.7;
  text-transform: uppercase;
  transition: all ease-in-out .325s;
  text-shadow: 0 1px 2px rgba(214, 161, 161, 0.05);
}
</style>
