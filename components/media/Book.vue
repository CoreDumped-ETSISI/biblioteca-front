<template>
  <b-card no-body class="overflow-hidden" style="max-width: 540px;">
    <b-row no-gutters>
      <b-col md="5">
        <b-card-img :src=this.imageSrc class="rounded-0"></b-card-img>
      </b-col>
      <b-col md="7">
        <b-card-body :title="title">
          <b-badge class="pxmargin" v-for="category in categories" variant="primary">{{ category }} </b-badge>
          <b-card-text>
            {{ this.description }}}
          </b-card-text>
            <b-dropdown dropup text="Descarga" variant="primary">
                <b-dropdown-item v-for="link in downloads" :href=link.url>{{ link.type }}</b-dropdown-item>
            </b-dropdown>
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { LoremIpsum } from "lorem-ipsum";


export default {    
    data(){
        return {
            title: 'Título',
            description: 'Descripción por defecto, quizá demasiado corta',
            imageSrc: 'https://picsum.photos/210/290',
            categories: [],
            downloads: [{'type':'PDF', 'url':'#'},{'type':'EPUB', 'url':'#'},{'type':'GBA', 'url':'#'}],
        }
    },
    mounted(){
        let lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4
        },
        wordsPerSentence: {
            max: 16,
            min: 4
        }
        });

        let title;
        let description;
        let categories = [];

        this.title = lorem.generateWords(3);
        this.description = lorem.generateSentences(5);
        this.categories.push(lorem.generateWords(1));
        this.categories.push(lorem.generateWords(1));
        this.categories.push(lorem.generateWords(1));
    }
}


</script>



<style scoped>
.pxmargin{
    margin-right: 2px;
}
</style>
