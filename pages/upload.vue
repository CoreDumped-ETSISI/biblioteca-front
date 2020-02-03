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

<!--
  <div>
		<div>
			<div class="row">
				<div class="col-md-9 m-auto">
					<h1 class="text-center display-4 my-4">Sube un libro</h1>
					<b-form-file v-model="file" :state="Boolean(file)"
						placeholder="Choose a file..."
						drop-placeholder="Drop file here..."
						accept=".pdf, .epub"
						v-on:change="fileChange()"
						name="book" class="mb-2"></b-form-file>
					<b-button 
						:disabled="!Boolean(file)"
						block class="mr-2" 
						variant="primary" 
						v-on:click="extractMeta()">
						Extract metadata
						<b-spinner small v-if="loaderVisible"></b-spinner>
					</b-button>
					<b-collapse id="collapse-1" :visible="isVisible">
						<b-form-group
							label-cols-lg="3"
							label="Title"
							label-size="lg"
							label-class="font-weight-bold pt-0"
							class="mb-0"
							>
							<b-form-group
								label-cols-sm="3"
								label="Title:"
								label-align-sm="right"
								label-for="nested-title"
								>
								<b-form-input id="nested-title" v-model="title"></b-form-input>
							</b-form-group>
							<b-form-group
								label-cols-sm="3"
								label="Author:"
								label-align-sm="right"
								label-for="nested-author"
								>
								<b-form-input id="nested-author"  v-model="author"></b-form-input>
							</b-form-group>
							<b-form-group
								label-cols-sm="3"
								label="Publisher:"
								label-align-sm="right"
								label-for="nested-publisher"
								>
								<b-form-input id="nested-publisher" v-model="publisher"></b-form-input>
							</b-form-group>
							<b-form-group
								label-cols-sm="3"
								label="Tags:"
								label-align-sm="right"
								label-for="nested-tags"
								>
								<b-badge 
									v-for="badge in getTags"
									v-bind:key="badge"
									variant="primary">{{badge}}
								</b-badge>
								<b-form-input id="nested-tags" v-model="tags"></b-form-input>
							</b-form-group>
							<b-form-group
								label-cols-sm="3"
								label="Publish Date:"
								label-align-sm="right"
								label-for="nested-date"
								>
								<b-form-input id="nested-date" type="number" v-model="date"></b-form-input>
							</b-form-group>
							<b-form-group
								label-cols-sm="3"
								label="Synopsis:"
								label-align-sm="right"
								label-for="nested-synopsis"
								>
								<b-form-textarea
									id="nested-synopsis"
									placeholder="Enter something..."
									rows="3"
									max-rows="4"
									v-model="synopsis"
									></b-form-textarea>
							</b-form-group>
							<b-form-group
								label-cols-sm="3"
								label="Language:"
								label-align-sm="right"
								label-for="nested-language"
								>
								<b-form-select v-model="selectedLanguage" id="nested-language">
									<option value="es">Español</option>
									<option value="en">Inglés</option>
								</b-form-select>
							</b-form-group>
							
							<hr>
							<b-form-file v-model="image" :state="Boolean(image)"
								placeholder="Choose a book cover..."
								drop-placeholder="Drop file here..."
								accept=".png, .PNG, .jpg, .JPG, .jpeg, .JPEG, .jpe, .JPE, .jif, .JIF, .jfif, .JFIF, .jfi, .JFI"
								name="image" class="mb-2"></b-form-file>
						</b-form-group>
						<b-button 
							block 
							class="mr-2" 
							variant="success" 
							:disabled="!isComplete"
							v-on:click="submitFile()">
							Upload File
						</b-button>
					</b-collapse>
				</div>
				<div class="text-center col-md-9" style="margin: 50px auto 0;">
					<b-spinner 
						class="center" 
						style="width: 3rem; height: 3rem;" 
						variant="warning" 
						label="Text Centered"
						v-if="buttonsLoading"
						></b-spinner>
				</div>
			</div>
		</div>
	</div>
!-->

<script>
import axios from "axios";
import topnavbar from "../components/Navbar.vue";
import uploadBook from "../components/upload/upload_book";
import editMetadata from "../components/upload/edit_metadata";
import Book from "../interfaces/book";

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
      console.log("Hey");
      this.$router.push({
        path: "/bookCatalogue"
      });
    },

    getData() {
      console.log(this.$route.params.name);
    },

    extractMeta(file) {
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
          console.log(response.data);
          const book = new Book(response.data);
          this.book = book;
          this.book.format = this.book.filename.split(".").pop();
          this.book.size = file.size;
          this.accepted = true;
        })
        .catch(err => {
          this.accepted = false;
          console.log(err);
          console.log("FAILURE!!");
        });
    },
    uploadBook(bookObject) {
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
          console.log(res);
          console.log(
            "%c Book uploaded successfully",
            "color: #00ff00, font-size: 16px"
          );
          console.log(res.data.message.sha1);
          this.uploadImage(imageFile, res.data.message.sha1);
        })
        .catch(err => {
          console.warn("Error on book upload");
          console.warn(err);
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
          console.log(res);
          console.log(
            "%c Book Cover uploaded successfully",
            "color: #00ff00, font-size: 16px"
          );
        })
        .catch(err => {
          console.log("Error uploading cover!!");
          console.log(err);
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
