<script>
import popupMessage from "../popup_message";
export default {
  components: {
    popupMessage
  },
  data() {
    return {
      newFile: {
        file: {},
        filename: "",
        fileExtension: ""
      },
      validExtensions: ["pdf", "epub"],
      validBook: false,
      popup: {
        show: false,
        duration: 5000,
        type: "error",
        title: "Error.",
        subtitle: "El formato del libro debe ser pdf o epub"
      }
    };
  },
  methods: {
    getBookFile(event) {
      if (event !== undefined && event.target.files.length > 0) {
        const file = event.target.files[0];
        const fileExtension = file.name.split(".").pop();
        const filename = file.name.substring(
          0,
          file.name.length - (fileExtension.length + 1)
        );
        if (!this.validExtensions.includes(fileExtension.toLowerCase())) {
          this.validBook = false;
          this.showPopup({
            show: true,
            duration: 3000,
            type: "error",
            title: "Error.",
            subtitle: "El formato del libro debe ser pdf o epub"
          });
        } else {
          this.newFile = { file, fileExtension, filename };
          this.validBook = true;
        }
      }
    },
    getSize(file) {
      const bytes = file.size;
      const decimals = 2;
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    showPopup(popup) {
      this.popup.show = true;
      this.popup = popup;
    },
    popupExit() {
      this.popup.show = false;
    },
    emitFile() {
      this.$emit("file", this.newFile.file);
    }
  }
};
</script>

<template>
  <div class="upload-container">
    <popupMessage
      v-on:finished="popupExit"
      v-if="popup.show"
      v-bind:popup="popup"
    ></popupMessage>
    <div class="upload-inner">
      <div class="upload-text">Sube un libro</div>
      <div class="upload-box">
        <input
          @change="getBookFile"
          type="file"
          name=""
          id="book-file"
          accept=".pdf, .epub"
        />
        <i class="material-icons">{{
          this.validBook ? "book" : "cloud_upload"
        }}</i>
        <div v-if="!this.validBook" class="subtitle noFile"></div>
        <div v-if="this.validBook" class="subtitle">
          <div class="filename">{{ this.newFile.filename }}</div>
          <div class="format">{{ this.newFile.fileExtension }}</div>
          <div class="size">{{ getSize(this.newFile.file) }}</div>
        </div>
        <div @click="emitFile" v-if="this.validBook" class="btn-upload">
          Extraer metadatos
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="sass" scoped>
.upload-container
    height: 100vh
    width: 100vw
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    background: var(--bg-color-2)
    .upload-inner
        width: 40vw
        height: 100%
        display: flex
        flex-direction: column
        justify-content: center
        align-items: flex-start
        .upload-text
            font-size: 24px
            margin-bottom: 10px
            color: var(--foreground-color-main)
        .upload-box
            width: 100%
            height: 35vh
            border: 4px dashed var(--main-color)
            border-radius: 10px
            display: flex
            flex-direction: column
            justify-content: center
            align-items: center
            cursor: pointer
            background: var(--main-color-alt-transparent)
            color: var(--main-color-alt-2-fg)
            position: relative
            #book-file
                opacity: 0
                width: 100%
                height: 100%
                position: absolute
                cursor: pointer
                z-index: 10
            i
                font-size: 72px
                margin-bottom: 20px
            .btn-upload
                padding: 5px 15px
                font-weight: bold;
                border-radius: 10px
                border: 2px solid var(--main-color-alt-2-fg);
                margin-top: 25px
                z-index: 12
                transition: all .25s ease-in-out
            .btn-upload:hover
                color: var(--bg-color-1);
                background:  var(--main-color-alt-2-fg);
            .subtitle.noFile::before
                display: inline
                content: 'Elige un archivo '
                font-weight: bold
            .subtitle.noFile::after
                display: inline
                content: 'o arrastra aqui un libro'
                font-weight: bold
            .subtitle:not(.noFile)
                display: flex
                flex-direction: column
                align-items: flex-start
                max-width: 95%
                .filename::before
                    content: 'Nombre: '
                    font-weight: bold
                    display: inline
                .filename
                    text-overflow: ellipsis
                    max-width: 30vw
                    white-space: nowrap;
                    overflow: hidden
                .format::before
                    font-weight: bold
                    content: 'Formato: '
                    display: inline
                .size::before
                    font-weight: bold
                    content: 'Tamaño: '
                    display: inline
</style>
