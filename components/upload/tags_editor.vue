<script>
import Book from "../../interfaces/book";
import axios from "axios";
import keywords from "../../middleware/keywords";
export default {
  props: {
    title: String,
    synopsis: String,
    tags: Array
  },
  data() {
    return {
      tagsArr: [""],
      allTags: []
    };
  },
  mounted() {
    this.getAllTags();
    this.tags = this.tags.length === 0 ? [""] : this.tags;
  },
  methods: {
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
      let bookKeywords = (this.synopsis + this.title).toLowerCase();
      let bookKeywordsArray = [];
      if (this.title !== "") {
        bookKeywordsArray.push(
          ...this.title
            .replace(/[,.;]/g, "")
            .toLowerCase()
            .split(" ")
        );
      }
      if (this.synopsis !== "") {
        bookKeywordsArray.push(
          ...this.synopsis
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
      suggestions = this.deleteHandyAddedTags(suggestions, this.tags);
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
      if (this.tags.length > 1 && innerTag === "") {
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
          this.removeTag(this.tags, index);
        }
      } else if (
        innerTag.charAt(innerTag.length - 1) === "," &&
        innerTag.length > 1
      ) {
        this.tags[index] = innerTag.replace(",", "").trim();
        if (index === this.tags.length - 1) {
          this.tags.push([""]);
        }
        tagEl.blur();
        await this.delay(50);
        if (document.getElementById("tag-" + (index + 1)) !== undefined) {
          document.getElementById("tag-" + (index + 1)).focus();
        }
      } else if (innerTag.charAt(innerTag.length - 1) === ",") {
        this.tags[index] = "";
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
      this.tags[i] = "";
      document.getElementById("tag-" + i).value = "";
    },
    async addTag(tag) {
      if (!this.tags.includes(tag)) {
        if (this.tags[this.tags.length - 1] === "") {
          this.tags.pop();
        }
        this.tags.push(...[tag, ""]);
        await this.delay(50);
        document.getElementById("tag-" + (this.tags.length - 1)).focus();
      }
    },
    deleteEmptyTags() {
      for (let i in this.tags) {
        if (this.tags[i] === "" && i < this.tags.length - 1)
          this.removeTag(this.tags, i);
      }
    },
    async addNewTag(len, e) {
      this.deleteEmptyTags();
      if (e.target === document.getElementById("tags-editor")) {
        if (
          this.tags[len - 1] !== "" &&
          typeof this.tags[len - 1] === "string"
        ) {
          this.tags.push("");
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
  <div class="tags">
    <div id="tags-editor" @click="addNewTag(tags.length, $event)">
      <div
        class="added-tag-div"
        v-for="(tag, index) in tags"
        :key="index"
        :style="{
          'background-color': getTagBackground(tags[index])
        }"
      >
        <input
          class="added-tag"
          :id="'tag-' + index"
          @input.prevent="onTagsInput(index, $event)"
          v-model="tags[index]"
          placeholder="Escribe una etiqueta"
          :style="{
            width: getTextWidth(tags[index], '18px Roboto') + 'px',
            background: 'transparent'
          }"
        />
        <div
          class="icon"
          @click="tags.length > 1 ? removeTag(tags, index) : emptyTag(index)"
        >
          <i class="material-icons">clear</i>
        </div>
      </div>
    </div>

    <div class="tags-suggest">
      <div class="tag-title">Sugerencias</div>
      <div class="hint" v-if="this.synopsis === '' && this.title === ''">
        Añade el titulo o una sinopsis para poder encontrar etiquetas
      </div>
      <div class="tags-row" v-if="this.synopsis !== '' || this.title !== ''">
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
</template>
<style lang="sass" scoped>
    input
        border: none
        background: transparent
        background: #F3F3F3
        border: none
        border-radius: 15px
        padding: 0 25px
        margin: 5px
        box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0,0,0,0.05)
        height: 45px
    #tags-editor
        border: none
        background: transparent
        background: #F3F3F3
        border: none
        border-radius: 15px
        padding: 0 25px
        margin: 5px
        box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0,0,0,0.05)
    .added-tag:focus
        outline: none
    .tags
        position: relative!important
        width: 100%!important
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
</style>
