<template>
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
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {    
    
    data(){
        return {
            description: 'Descripción por defecto, quizá demasiado corta',
            imageSrc: 'http://localhost:3003/'+this.sha1+'.'+this.imageFormat,
            downloads: [{'type':'PDF', 'url':'#'},{'type':'EPUB', 'url':'#'},{'type':'GBA', 'url':'#'}],
            languages: {'es':{'variant':'danger', 'name':'Español'}, 
                'en':{'variant':'warning', 'name':'Inglés'}},
            statuses: ['pending', 'accepted', 'denied', 'erased'],
            selected: this.status,
            librosString: ['libro1.png', 'libro2.png', 'libro3.png', 'libro4.png'],
            options: [
							{ item: 'pending', text: 'Status: pending' },
							{ item: 'accepted', text: 'Status: accepted' },
							{ item: 'denied', text: 'Status: denied' },
							{ item: 'erased', text: 'Status: erased' }
						]
        }
    },
    computed: {
      getBookWithImage() {
        if(this.imageFormat == '')
          return 'http://localhost:3003/'+this.librosString[Math.floor(Math.random() * this.librosString.length)]
        
        return 'http://localhost:3003/'+this.sha1+'.'+this.imageFormat
      },
      getTag(){
        return this.languages[this.language]
      },
      getUnits(){
        var bytes = this.size;
        var decimals = 2
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      },
      getDate(){
        return moment(String(this.uploadDate)).format('MM/DD/YYYY hh:mm')
      }
    },
    props: {
        title: String,
        author: String,
        synopsis: String,
        publisher: String,
        status: String,
        tags: Array,
        size: Number,
        filename: String,
        format: String,
        imageFormat: String,
        language: String,
        sha1: String,
        id: String,
        uploadDate: Date
    },

    methods: {
      onChange(){
					console.log(this.selected)
					axios.put(`http://localhost:3003/book/`+this.id, {
						status: this.selected 
					})
					.then(response => {console.log(response)})
					.catch(e => {
						this.errors.push(e)
						console.log('error')
					})
				},
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
.limitLines {
  overflow: hidden;
  position: relative; 
  line-height: 1.2em;
  max-height: 7.2em; 
  margin-right: -1em;
  padding-right: 1em;
}
</style>
