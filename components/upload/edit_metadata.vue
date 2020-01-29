<script>
import Book from "../../interfaces/book";
import axios from "axios";
import keywords from "../../middleware/keywords";
import tagsEditor  from "./tags_editor.vue"
export default {
  props: {
    book: Book,
    file: File
  },
  components: {
    tagsEditor
  },
  data() {
    return {
      imageURL: "",
      imageFile: undefined,
      tagsStr: "",
      lastTag: "",
      tagsArr: [""],
      allTags: []
    };
  },
  mounted() {
    this.book.tags = this.book.tags.length === 0 ? [""] : this.book.tags;
  },
  methods: {
    extractImageFromPDF() {
      let url = URL.createObjectURL(this.file);
      import("pdfjs-dist/webpack").then(PDFJS => {
        PDFJS.disableWorker = true;
        PDFJS.getDocument(url).then(pdf => {
          pdf.getPage(1).then(page => {
            let myCanvas = document.getElementById("canvas-pdf");
            let context = myCanvas.getContext("2d");
            let viewport = page.getViewport(1);
            myCanvas.width = viewport.width;
            myCanvas.height = viewport.height;
            page
              .render({
                canvasContext: context,
                viewport
              })
              .then(() => {
                this.imageURL = myCanvas.toDataURL("image/png");
                myCanvas.toBlob(blob => {
                  const file = this.blobToFile(blob, "image.png");
                  this.imageFile = file;
                });
              });
          });
        });
      });
    },
    blobToFile: (blob, filename) => {
      blob.lastModifiedDate = new Date();
      blob.name = filename;
      return blob;
    },
    setLang(lang) {
      this.book.language = lang;
    }
  }
};
</script>

<template>
  <div id="uploadBox">
    <canvas id="canvas-pdf"></canvas>
    <div class="maxh" id="viewPanel">
      <div :class="{ 'img-uploaded': this.imageURL !== '' }" class="cover-container">
        <img
          class="cover-default"
          :src="
            this.imageURL === ''
              ? require('../../assets/book_def_cover_' +
                  Math.floor(Math.random() * 4) +
                  '.png')
              : this.imageURL
          "
          alt
        />
        <div class="img-uploader-container">
          <div class="book-upload">
            <i class="material-icons">add_photo_alternate</i>
          </div>
          <div class="spacer"></div>
          <div class="menu">
            <div class="opt">Subir imagen</div>
            <div class="opt" @click="extractImageFromPDF">Extraer del PDF</div>
          </div>
        </div>
      </div>
    </div>
    <div class="maxh" id="editPanel">
      <form action="onSubmit()">
        <div class="input-title">
          <input type="text" name="title" v-model="book.title" placeholder="Titulo" id="title" />
          <input v-model="book.author" type="text" name="author" placeholder="Autor" id="author" />
        </div>
        <div class="input-info">
          <input
            type="text"
            name="publisher"
            placeholder="Editorial"
            id="publisher"
            v-model="book.publisher"
          />
          <input
            v-model="book.publishDate"
            type="text"
            name="publishYear"
            placeholder="Año de publicación"
            id="publishYear"
          />
          <div id="select-lang">
            <div class="placeholder">
              <div class="val">
                {{
                book.language !== "" ? book.language : "Selecciona un idioma"
                }}
              </div>
              <i class="material-icons">arrow_drop_down</i>
            </div>
            <div class="menu">
              <div @click="setLang('Español')">Español</div>
              <div @click="setLang('English')">English</div>
            </div>
          </div>
        </div>
        <textarea v-model="book.synopsis" name="synopsis" placeholder="Sinopsis" id="synopsis"></textarea>
        <tagsEditor :title="book.title" :synopsis="book.synopsis" :tags="book.tags"></tagsEditor>
        <div class="buttons-container">
          <div class="btn cancel">
            <i class="material-icons">arrow_back_ios</i> Cancelar y subir otro libro
          </div>
          <div class="btn publish">PUBLICAR</div>
        </div>
      </form>
    </div>
  </div>
</template>
<style lang="sass" scoped>
#canvas-pdf
    display: none
#uploadBox
    display: flex
    justify-content: space-between
    align-items: center
    width: 100vw
    height: 100vh
    min-height: 100vh
    padding: calc(68px + 7.5vh) 10vw 7.5vh
    .maxh
        height: 100%
    #viewPanel
        display: flex
        flex-direction: center
        justify-content: center
        width: 30%
        .cover-container.img-uploaded
            height: min-content
            img.cover-default
                object-fit: fill
                height: auto
            .book-upload
                opacity: 0
        .cover-container.img-uploaded:hover
            .book-upload
                opacity: .6
        .cover-container:not(.img-uploaded)
            height: 370px
            img.cover-default
                object-fit: cover
                height: 100%
            .book-upload
                opacity: .6

        .cover-container
            width: 75%
            position: relative
            img.cover-default
                width: 100%
                border-radius: 15px
                object-position: center
                position: relative
                transition: all .25s ease-in-out;
                box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0,0,0,0.05)
        .img-uploader-container
            position: absolute
            height: 100%
            width: 100%
            top: 0
            left: 0
            .menu, .spacer
                position: absolute
            .spacer
                width: 72px
                height: 25px
                top: calc(50% + 30px)
                left: calc(50% - 36px)
            .menu
                display: none
                width: 75%
                height: min-content
                background: white
                border-radius: 15px
                left: 12.5%
                top: calc(50% + 50px)
                box-shadow: 0px 3px 6px 2px rgba(255, 255, 255, 0.01), 0 3px 6px rgba(255,255,255,0.23);
                .opt
                    display: flex
                    justify-content: center
                    align-items: center
                    padding: 7.5px 0
                    font-weight: bold
                    cursor: pointer
                .opt:not(:last-child)
                    border-bottom: 1px solid #e6e6e6
            .book-upload
                display: flex
                justify-content: center
                align-items: center
                width: 72px
                height: 72px
                border-radius: 50%
                border: 2px solid white;
                background: black
                position: absolute
                left: calc(50% - 36px)
                top: calc(50% - 36px)
                transition: opacity .25s ease-in-out
                cursor: pointer
                i
                    font-size: 36px
                    color: white
            .book-upload:hover
                opacity: .75
        .img-uploader-container
            .book-upload:hover + .spacer + .menu,
            .spacer:hover + .menu,
            .menu:hover
                display: flex
                flex-direction: column
    #editPanel
        width: 70%
        form
            width: 100%
            display: flex
            flex-direction: column
            input, textarea, #select-lang
                border: none
                background: transparent
                background: #F3F3F3
                border: none
                border-radius: 15px
                padding: 0 25px
                margin: 5px
                box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0,0,0,0.05)
            input
                height: 45px

            textarea, #tags-editor
                font-size: 18px
                margin-top: 10px
                min-height: 120px
                padding: 10px 25px
            input:focus , textarea:focus, select:focus, #tags-editor:focus
                outline: none
            .input-info
                display: flex
                justify-content: space-between
                width: 100%
                input:first-child
                    width: 48%
                input:not(:first-child)
                    width: 23%
            .input-title
                display: flex
                justify-content: space-between
                width: 100%
                input:first-child
                  width: 65%
                input:not(:first-child)
                  width: 32%
            #select-lang
                position: relative
                width: 28%
                .placeholder
                  width: 100%
                  height: 100%
                  display: flex
                  justify-content: space-between
                  cursor: pointer
                  align-items: center
                  div:not(.val)
                    display: flex
                    align-items: center
                .placeholder:after
                  content: ''
                  display: block
                  position: absolute
                  height: 10px
                  width: 100%
                  bottom: 0
                  left: 0
                  transform: translateY(100%)
                .menu
                  display: none
                  position: absolute
                  bottom: 0
                  left: 0
                  transform: translateY(calc(100% + 7.5px))
                  width: 100%
                  border-radius: 15px
                  background: #F3F3F3
                  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0,0,0,0.05)
                  cursor: pointer
                  div
                    width: 100%
                    height: 40px
                    display: flex
                    align-items: center
                    padding-left: 15px
                  div:not(:last-child)
                    border-bottom: 1px solid #d9d9d9
            #select-lang:hover
                .menu
                  display: flex
                  flex-direction: column
            
            .buttons-container
              transform: translateY(100%)
              margin-top: 45px
              display: flex
              justify-content: flex-end
              align-items: center
              .btn
                height: 50px
                display: flex
                align-items: center
                justify-content: center
                cursor: pointer
                color: #0d860f
                padding: 0 30px
                border-radius: 25px
                transition: all .25s ease-in-out
              .btn.publish
                font-size: 20px
                border: 2px solid #0d860f
                color: white
                background: #0d860f
                font-weight: bold
                margin-left: 10px
                box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.05);
              .btn.publish:hover
                color: white
              .btn.cancel
                color: black
                opacity: .7
                i.material-icons
                  color: #494949
</style>