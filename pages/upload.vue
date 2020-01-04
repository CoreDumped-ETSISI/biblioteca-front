<template>
  <div class="container" v-if="accessible">
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
</template>

<script>
    import axios from 'axios';
    
  export default {
    data(){
      return {
        accessible: false,
        file: '',
        image: '',
        buttonsLoading: false,
        author: "",
        title: "",
        publisher: "",
        tags: "",
        date: null,
        synopsis: "",
        isVisible: false,
        loaderVisible: false,
        selectedLanguage: "en",
        badges: "     hola     ,     adios    ,     hasta luego    , "
      }
    },
    computed: {
      isComplete () {
        return this.file && this.author && this.title
          && this.publisher && this.date && this.synopsis;
      },
      getTags () {
        var tagArr = this.tags.split(",")
        for(var i=0;i<tagArr.length;i++)
          tagArr[i] = tagArr[i].trim()
        if(tagArr[tagArr.length-1] === "")
          tagArr.pop();
        return tagArr;
      }
    },

    methods: {
      changePage(redirect){
        console.log("Hey")
        this.$router.push({
            path: redirect
        })
      },

      getData(){
        console.log(this.$route.params.name)
      },

      extractMeta(){
        let formData = new FormData();
        let localThis = this

        formData.append('book', this.file);
        localThis.loaderVisible = true
    
        axios.post( 'http://localhost:3003/book/getMetadata',
            formData,
            {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        ).then(function(response){
          console.log(response)
          localThis.author = response.data.author
          localThis.title = response.data.title
          localThis.synopsis = response.data.synopsis
          localThis.publisher = response.data.publisher
          localThis.date = response.data.publishDate
          if(response.data.language!=null && ["en", "es"].includes(response.data.language)){
            console.log("Language is "+response.data.language)
            localThis.selectedLanguage = response.data.language
          }
          localThis.selectedLanguage
          localThis.isVisible = true
          localThis.loaderVisible = false
          console.log('SUCCESS!!');
          })
        .catch(function(err){
          console.log(err)
          console.log('FAILURE!!');
        });
      },

      submitFile(){
        this.buttonsLoading = true;
        let localThis = this
           console.log(this.file);
            let formData = new FormData();

            let data = {
              title: this.title,
              author: this.author,
              synopsis: this.synopsis,
              date: this.date,
              publisher: this.publisher,
              tags: this.getTags,
              size: this.file.size,
              imageFormat: this.image.name.split('.')[1],
              language: this.selectedLanguage
            }

            formData.append('book', this.file);
            formData.append('data', JSON.stringify(data));

            console.log(data);


            axios.post( 'http://localhost:3003/book/uploadBook',
                formData,
                {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            ).then(function(response){
              console.log(response)
              console.log('SUCCESS BOOK!!');
              console.log(response.data.message.sha1)
              localThis.uploadImage(response.data.message.sha1)
            })
            .catch(function(err){
              console.log(err)
              console.log('FAILURE!!');
            });
      },

      fileChange(){
        this.isVisible = false
        this.image = ''
        this.imagebuttonsLoading = false
        this.imageauthor = ""
        this.imagetitle = ""
        this.imagepublisher = ""
        this.imagedate = null
        this.imagesynopsis = ""
        this.imageisVisible = false
        this.imageloaderVisible = false
        this.imageselectedLanguage = "en"
      },

      uploadImage(sha1){
        let localThis = this
        console.log(this.file);
        let formData = new FormData();

        let data = {
          sha1: sha1
        }

        formData.append('image', this.image);
        formData.append('data', JSON.stringify(data));

        console.log(formData);


        axios.post( 'http://localhost:3003/book/uploadImage',
            formData,
            {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        ).then(function(response){
          console.log(response)
          console.log('SUCCESS!!');
          localThis.changePage('/bookCatalogue');
        })
        .catch(function(err){
          console.log(err)
          console.log('FAILURE!!');
        });
      },

      
      handleFileUpload(){
        this.file = this.$refs.file.files[0];
      }
    },

    mounted() {
      if(localStorage.getItem("user-token") == null)
      this.changePage('/login')
    else
      this.accessible = true
    }
  }
</script>

<style>
  #collapse-1 {
    margin: 20px;
  }
</style>
