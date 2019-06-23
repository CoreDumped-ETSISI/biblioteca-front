<template>
  <b-card no-body class="overflow-hidden" style="max-width: 540px;">
    <b-row no-gutters>
      <b-col md="5">
        <b-card-img :src=this.imageSrc class="rounded-0"></b-card-img>
        <b-button class="topmargin" variant="success" v-on:click="download()">Descarga</b-button>
      </b-col>
      <b-col md="7">
        <b-card-body :title="title" :sub-title="author">
          <b-card-text>
            {{ this.synopsis }}
          </b-card-text>
          <b-list-group flush>
            <b-list-group-item><strong>Paginas: </strong>{{ pageNumber }}</b-list-group-item>
            <b-list-group-item><strong>Categoría: </strong>{{ category }}</b-list-group-item>
            <b-list-group-item><strong>Editorial: </strong>{{ publisher }}</b-list-group-item>
            <b-list-group-item><strong>Tamaño (Bytes): </strong>{{ size }}</b-list-group-item>
            </b-list-group>

        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import axios from 'axios';

export default {    
    
    data(){
        return {
            description: 'Descripción por defecto, quizá demasiado corta',
            imageSrc: 'https://picsum.photos/210/290',
            downloads: [{'type':'PDF', 'url':'#'},{'type':'EPUB', 'url':'#'},{'type':'GBA', 'url':'#'}]
        }
    },
    props: {
        title: String,
        author: String,
        synopsis: String,
        category: String,
        publisher: String,
        pageNumber: Number,
        size: Number,
        filename: String,
        format: String
    },
    methods: {
        download(){
            let url = 'http://localhost:3003/book/download/'+this.filename
            axios({
                url: url,
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                console.log(response)
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', this.title+"-"+this.author+'.'+this.format); //or any other extension
                document.body.appendChild(link);
                link.click();
            }).catch(function(err){
              console.log(err)
              console.log('FAILURE!!');
            });
        }
    }
}


</script>



<style scoped>
.pxmargin{
    margin-right: 2px;
}
.topmargin {
    display: block;
    width: 100%;
    margin-top: 5px;
}
</style>
