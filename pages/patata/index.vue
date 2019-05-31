<template>
  <div class="container">
    <div>
      <div class="row">
        <div class="col-md-9 m-auto">
          <h1 class="text-center display-4 my-4">Mongo File Uploads</h1>
          <b-form-file v-model="file" :state="Boolean(file)"
            placeholder="Choose a file..."
            drop-placeholder="Drop file here..."
            accept=".pdf, .epub"
            name="book" class="mb-2"></b-form-file>

          <b-button block class="mr-2" variant="success" v-on:click="submitFile()">Upload File</b-button>
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
    /*
      Defines the data used by the component
    */
    data(){
      return {
        file: '',
        buttonsLoading: false
      }
    },

    methods: {
      /*
        Submits the file to the server
      */
      submitFile(){
        /*
                Initialize the form data
            */
        this.buttonsLoading = true;
           console.log(this.file);
            let formData = new FormData();

            formData.append('book', this.file);
        
            axios.post( 'http://localhost:3003/book/uploadBook',
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }
            ).then(function(){
          console.log('SUCCESS!!');
          buttonsLoading = false;
        })
        .catch(function(){
          console.log('FAILURE!!');
        });
      },

      
      handleFileUpload(){
        this.file = this.$refs.file.files[0];
      }
    }
  }
</script>
