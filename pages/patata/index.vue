<template>
  <div class="container">
      <h1>Me comes la patata</h1>
    <p>Y si no te apetece, me da igual. Te la vas a comer de todas formas.</p>
    <div class="large-12 medium-12 small-12 cell">
      <!--<label>File
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
      </label>-->
      <b-form-file
      v-model="file"
      :state="Boolean(file)"
      placeholder="Choose a file..."
      drop-placeholder="Drop file here..."
      accept=".pdf, .epub"
      name="book"
    ></b-form-file>
    <div class="mt-3" v-on:change="handleFileUpload()">Selected file: {{ file ? file.name : '' }}</div>
      <b-button variant="success" v-on:click="submitFile()">Upload</b-button>
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
        file: ''
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

