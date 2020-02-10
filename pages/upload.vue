<template>
  <div>
    <topnavbar :logged="true"></topnavbar>
    <uploadBook v-on:file="extractMeta" v-if="!this.accepted"></uploadBook>
    <editMetadata
      @onUploadBook="uploadBook"
      @cancelUpload="cancelUpload"
      v-bind:book="this.book"
      :file="this.file"
      v-if="this.accepted"
    ></editMetadata>
  </div>
</template>

<script>
import axios from "axios";
import topnavbar from "../components/Navbar.vue";
import uploadBook from "../components/upload/upload_book";
import editMetadata from "../components/upload/edit_metadata";
import Book from "../interfaces/book";
import { spinnerService } from "@/services/spinnerService";
import { popupService } from "@/services/popupService";

export default {
  middleware: "auth",
  components: {
    topnavbar,
    uploadBook,
    editMetadata
  },
  data() {
    return {
      file: {},
      book: new Book({}),
      accepted: false
    };
  },
  computed: {
    getTags() {
      var tagArr = this.tags.split(",");
      for (var i = 0; i < tagArr.length; i++) tagArr[i] = tagArr[i].trim();
      if (tagArr[tagArr.length - 1] === "") tagArr.pop();
      return tagArr;
    }
  },

  methods: {
    cancelUpload() {
      this.file = {};
      this.book = new Book({});
      this.accepted = false;
    },
    changePage() {
      this.$router.push({
        path: "/bookCatalogue"
      });
    },

    getData() {
      console.log(this.$route.params.name);
    },

    extractMeta(file) {
      spinnerService.setSpinnerStatus(true);
      this.file = file;
      let formData = new FormData();

      formData.append("book", file);

      axios
        .post("http://192.168.0.104:3003/book/getMetadata", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          spinnerService.setSpinnerStatus(false);
          console.log(response.data);
          const book = new Book(response.data);
          this.book = book;
          this.book.format = this.book.filename.split(".").pop();
          this.book.size = file.size;
          this.accepted = true;
        })
        .catch(err => {
          spinnerService.setSpinnerStatus(false);
          this.accepted = false;
          console.log(err);
          console.log("FAILURE!!");
        });
    },
    uploadBook(bookObject) {
      spinnerService.setSpinnerStatus(true);

      const book = bookObject.book;
      const imageFile = bookObject.imageFile;
      console.log(JSON.stringify(book));
      let formData = new FormData();
      formData.append("book", this.file);
      formData.append("data", JSON.stringify(book));

      axios
        .post("http://192.168.0.104:3003/book/uploadBook", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          popupService.setPopup({
            show: true,
            duration: 3000,
            type: "success",
            title: "Libro subido!",
            subtitle: "El libro se ha subido correctamente!"
          });
          console.log(
            "====================\n%c Book uploaded successfully:",
            "color: #00ff00; font-size: 16px"
          );
          console.log(res);
          console.log("=======================================");
          this.uploadImage(imageFile, res.data.message.sha1);
        })
        .catch(err => {
          spinnerService.setSpinnerStatus(false);
          popupService.setPopup({
            show: true,
            duration: 3000,
            type: "error",
            title: "Error...",
            subtitle: "Error al subir el libro"
          });
          console.warn("================\nError on book upload");
          console.warn(err);
          console.warn("====================");
        });
    },
    uploadImage(image, sha1) {
      let formData = new FormData();
      const name = "imageFromPdf-" + new Date().getTime() + ".png";

      const data = { sha1 };
      formData.append("image", image, name);
      formData.append("data", JSON.stringify(data));

      axios
        .post("http://192.168.0.104:3003/book/uploadImage", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          spinnerService.setSpinnerStatus(false);
          console.log(res);
          console.log(
            "%c Book Cover uploaded successfully",
            "color: #00ff00; font-size: 16px"
          );
          this.changePage();
        })
        .catch(err => {
          spinnerService.setSpinnerStatus(false);
          popupService.setPopup({
            show: true,
            duration: 3000,
            type: "error",
            title: "Error...",
            subtitle: "Error al subir el cover del libro"
          });
          console.log("Error uploading cover!!");
          console.log(err);
          this.changePage();
        });
    }
    /*  
      uploadImage(sha1) {
        let localThis = this
        console.log(this.file);
        let formData = new FormData();

        let data = {
          sha1: sha1
        }

        formData.append('image', this.image);
        formData.append('data', JSON.stringify(data));

        console.log(formData);


        axios.post('http://192.168.0.104:3003/book/uploadImage',
            formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          ).then(function (response) {
            console.log(response)
            console.log('SUCCESS!!');
            localThis.changePage();
          })
          .catch(function (err) {
            console.log(err)
            console.log('FAILURE!!');
          });
      },


      handleFileUpload() {
        this.file = this.$refs.file.files[0];
      }*/
  }
};
</script>

<style>
#collapse-1 {
  margin: 20px;
}
</style>
