<script>
import Book from "../../interfaces/book";
import axios from "axios";
import keywords from "../../middleware/keywords";
export default {
  props: {
    book: Book,
    file: File
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
    this.getAllTags();
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
    },
    getAllTags() {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token")
        }
      };
      axios
        .get(`http://localhost:3003/book/getAllBooks`, config)
        .then(response => {
          const books = response.data.books;
          for (let book of books) {
            this.allTags.push(...book.tags);
          }
          this.allTags.push(...keywords.other);
          this.allTags = this.allTags.map(tag => tag.toLowerCase());
          this.allTags = this.deleteDuplicates(this.allTags);
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    tagsCoincidences() {
      let bookKeywords = (this.book.synopsis + this.book.title).toLowerCase();
      let bookKeywordsArray = [];
      if (this.book.title !== "") {
        bookKeywordsArray.push(
          ...this.book.title
            .replace(/[,.;]/g, "")
            .toLowerCase()
            .split(" ")
        );
      }
      if (this.book.synopsis !== "") {
        bookKeywordsArray.push(
          ...this.book.synopsis
            .replace(/[,.;]/g, "")
            .toLowerCase()
            .split(" ")
        );
      }
      let suggestions = this.intersection(this.allTags, bookKeywords);
      suggestions.push(
        ...this.intersection(
          bookKeywordsArray,
          keywords.languages.map(el => el.toLowerCase())
        )
      );

      suggestions = this.deleteDuplicates(suggestions);
      suggestions = this.deleteHandyAddedTags(suggestions, this.book.tags);
      return suggestions;
    },
    deleteHandyAddedTags: (suggestions, tags) =>
      suggestions.filter(tag => !tags.includes(tag)),
    deleteDuplicates: array =>
      array.reduce(
        (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
        []
      ),
    intersection: (arrayA, arrayB) => arrayA.filter(el => arrayB.includes(el)),
    async onTagsInput(index, event) {
      const tagEl = document.getElementsByClassName("added-tag")[index];
      let innerTag = tagEl.value;
      if (this.book.tags.length > 1 && innerTag === "") {
        if (
          [
            "deleteContentBackward",
            "deleteContentForward",
            "deleteByCut"
          ].includes(event.inputType)
        ) {
          if (index > 0) {
            document.getElementById("tag-" + (index - 1)).focus();
          }
          this.removeTag(this.book.tags, index);
        }
      } else if (
        innerTag.charAt(innerTag.length - 1) === "," &&
        innerTag.length > 1
      ) {
        this.book.tags[index] = innerTag.replace(",", "").trim();
        if (index === this.book.tags.length - 1) {
          this.book.tags.push([""]);
        }
        tagEl.blur();
        await this.delay(50);
        if (document.getElementById("tag-" + (index + 1)) !== undefined) {
          document.getElementById("tag-" + (index + 1)).focus();
        }
      } else if (innerTag.charAt(innerTag.length - 1) === ",") {
        this.book.tags[index] = "";
      }
    },

    delay: ms => new Promise(r => setTimeout(r, ms)),
    getTextWidth: (text, font = "14px Roboto") => {
      if (text === "" || typeof text !== "string") {
        text = "Escribe una etiqueta";
      }
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      context.font = font;
      let metrics = context.measureText(text);
      return metrics.width;
    },
    getTagBackground: tag =>
      tag === "" || typeof tag === "object" ? "#F5F5F5cc" : "#F5F5F5",
    removeTag: (tags, i) => tags.splice(i, 1),
    emptyTag(i) {
      this.book.tags[i] = "";
      document.getElementById("tag-" + i).value = "";
    },
    async addTag(tag) {
      if (!this.book.tags.includes(tag)) {
        if (this.book.tags[this.book.tags.length - 1] === "") {
          this.book.tags.pop();
        }
        this.book.tags.push(...[tag, ""]);
        await this.delay(50);
        document.getElementById("tag-" + (this.book.tags.length - 1)).focus();
      }
    },
    deleteEmptyTags() {
      for (let i in this.book.tags) {
        if (this.book.tags[i] === "" && i < this.book.tags.length - 1)
          this.removeTag(this.book.tags, i);
      }
    },
    async addNewTag(len, e) {
      this.deleteEmptyTags()
      if (e.target === document.getElementById("tags-editor")) {
        if (
          this.book.tags[len - 1] !== "" &&
          typeof this.book.tags[len - 1] === "string"
        ) {
          this.book.tags.push("");
          await this.delay(100); //dejemos 100ms para cargar el componente
          document.getElementById("tag-" + len).focus();
        } else {
          document.getElementById("tag-" + (len - 1)).focus();
        }
      }
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
        <div class="tags">
          <div id="tags-editor" @click="addNewTag(book.tags.length, $event)">
            <div
              class="added-tag-div"
              v-for="(tag, index) in book.tags"
              :key="index"
              :style="{
                'background-color': getTagBackground(book.tags[index])
              }"
            >
              <input
                class="added-tag"
                :id="'tag-' + index"
                @input.prevent="onTagsInput(index, $event)"
                v-model="book.tags[index]"
                placeholder="Escribe una etiqueta"
                :style="{
                  width: getTextWidth(book.tags[index], '18px Roboto') + 'px',
                  background: 'transparent'
                }"
              />
              <div
                class="icon"
                @click="
                  book.tags.length > 1
                    ? removeTag(book.tags, index)
                    : emptyTag(index)
                "
              >
                <i class="material-icons">clear</i>
              </div>
            </div>
          </div>

          <div class="tags-suggest">
            <div class="tag-title">Sugerencias</div>
            <div
              class="hint"
              v-if="this.book.synopsis === '' && this.book.title === ''"
            >Añade el titulo o una sinopsis para poder encontrar etiquetas</div>
            <div class="tags-row" v-if="this.book.synopsis !== '' || this.book.title !== ''">
              <div
                class="tag"
                v-bind:key="tag"
                v-for="tag of this.tagsCoincidences()"
                @click="addTag(tag)"
              >
                {{ tag }}
                <i class="material-icons">add</i>
              </div>
            </div>
          </div>
        </div>
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
            input, textarea, #select-lang, #tags-editor
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
            .tags
              position: relative
              width: 100%
              display: flex
              #tags-editor
                padding: 10px 20px
                position: relative
                width: 100% !important
                min-height: 50px
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                flex-direction: row
                color: transparent;
                display: flex
                justify-content: flex-start
                align-items: flex-start
                flex-wrap: wrap
                .added-tag-div
                  height: 30px;
                  display: flex
                  align-items: center
                  height: 35px
                  margin: 2.5px
                  border-radius: 10px
                  padding: 0 0 !important
                  width: calc(min-content + 500px)
                  border-radius: 10px
                  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.05)
                  .icon
                    cursor: pointer;
                    margin: 0 10px
                    color: #000000ce
                    display: flex
                    align-items: center
                    transition: color .25s ease-in-out
                    i
                      font-size: 18px
                  .icon:hover
                    color: black
                  .added-tag
                    font-size: 14px
                    box-shadow: none
                    color: #000000
                    width: calc(100% + 20px)
                    height: 100%
                    padding: 0
                    margin: 0 0 0 10px
                    text-align: center
                    caret-color: #000000aa
                  .added-tag::placeholder
                    color: #000000bb


              .tags-suggest
                position: absolute
                bottom: 0
                left: 5px
                transform: translateY(calc(100% - 5px))
                height: 50px
                border-top: 1px solid #d9d9d9
                display: flex
                align-items: center
                width: calc(100% - 10px)
                box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0,0,0,0.05)
                background: #F5F5F5
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
                padding: 0 25px;
                .tag-title
                  font-weight: 500
                  height: 32px
                  padding: 0 10px
                  display: flex
                  align-items: center
                  color: #000000f0
                  border-radius: 10px
                .tags-row, .hint
                  margin-left: 10px
                .hint
                  opacity: .75
                .tags-row
                  width: 100%
                  height: 100%
                  display: flex
                  align-items: center
                  overflow-x: auto
                  overflow-y: hidden
                  flex-wrap: nowrap
                  .tag
                    padding: 0 10px
                    height: 25px
                    background: #FCFCFC
                    color: #000000cc
                    border-radius: 7.5px
                    margin-right: 7.5px
                    display: flex
                    flex: 0 0 auto;
                    align-items: center
                    cursor: pointer;
                    transition: background .25s ease-in-out;
                    padding: 5 10px
                    box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.05);
                    i
                      font-size: 18px
                      margin-left: 7.5px
                  .tag:hover
                    background: #F3F3F3;
                .tags-row::-webkit-scrollbar
                  display: none
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