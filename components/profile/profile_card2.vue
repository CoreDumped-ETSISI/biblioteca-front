<script>
import axios from "axios";
export default {
  data() {
    return {
        imageURL: "",
        imageFile: undefined,
        username: "",
        firstname: "",
        lastname: "",
        creation: undefined,
        books: []
    };
  },
  mounted() {
    let config = {
      headers: { Authorization: "Bearer " + localStorage.getItem("user-token") }
    };
    axios
      .get(`http://localhost:3003/user/getByName/`+localStorage.getItem("user-name"), config)
      .then(response => {
          console.log(response.data)
          this.username = response.data.user[0].userName;
          this.firstname = response.data.user[0].firstName;
          this.lastname = response.data.user[0].lastName;
            this.creation = response.data.user[0].creation;
      })
      .catch(e => {
        this.errors.push(e);
      });
  },
  methods: {
    removeCover() {
      this.imageURL = "";
      this.imageFile = undefined;
    },
    blobToFile: (blob, filename) => {
      blob.lastModifiedDate = new Date();
      blob.name = filename;
      blob.filename = filename;
      console.log(blob);
      return blob;
    },
    onImageChanged(e) {
      const file = e.target.files[0];
      this.book.imageFormat = file.name.split(".").pop();
      const url = URL.createObjectURL(file);
      this.imageURL = url;
      this.imageFile = file;
    }
  }
};
</script>

<template>
  <div id="uploadBox">
    <canvas id="canvas-pdf"></canvas>
    <div class="maxh" id="viewPanel">
      <div
        :class="{ 'img-uploaded': this.imageURL !== '' }"
        class="cover-container"
      >
        <img class="cover-default" :src="this.imageURL" alt />
        <div class="img-uploader-container">
          <div class="book-upload">
            <i class="material-icons">add_photo_alternate</i>
          </div>
          <div class="spacer"></div>
          <div class="menu">
            <input
              type="file"
              name="imageFile"
              id="uploadImg"
              accept="image/*"
              @change="onImageChanged"
              visible="false"
            />
            <label class="opt" for="uploadImg" style="margin: 0">
              <div>Subir imagen</div>
            </label>
           
            <div
              class="opt"
              v-if="imageFile !== undefined"
              @click="removeCover"
            >
              Eliminar imagen
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="maxh" id="editPanel">
      <form @submit.prevent="onSubmit">
        <div class="input-title">
          <p class="myinput">{{username}}</p>
          <p class="myinput">{{firstname}}</p>
        </div>
        <div class="input-info">
          <p class="myinput">{{lastname}}</p>
          <p class="myinput">{{creation}}</p>
        </div>
        <div class="buttons-container">
          <div class="btn cancel" @click="cancelUpload">
            <i class="material-icons">arrow_back_ios</i> Cancelar y subir otro
            libro
          </div>
          <button class="btn publish" type="submit">PUBLICAR</button>
        </div>
      </form>
    </div>
  </div>
</template>
<style lang="sass" scoped>
.myinput
    color: var(--foreground-color-main);
    background: var(--bg-color-input);
    border: none;
    border-radius: 15px;
    padding: 0 25px;
    margin: 5px;
    box-shadow: var(--shadow-input);
    width: 100%;
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
    background: var(--bg-color-2)
    .maxh
        height: 100%
    #viewPanel
        display: flex
        flex-direction: center
        justify-content: center
        width: 30%
        .cover-container.img-uploaded
            height: min-content
            #uploadImg
              display: none
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
                    color: var(--bg-color-1);
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

            .input-info
                display: flex
                justify-content: space-between
                width: 100%
                div:first-child
                    width: 46%
                div:not(:first-child)
                    width: 23%
            .input-title
                display: flex
                justify-content: space-between
                width: 100%
                div:first-child
                  width: 65%
                div:not(:first-child)
                  width: 34%
            #select-lang
                background: var(--bg-color-input)
                border-radius: 15px
                color: var(--foreground-color-main);
                background: var(--bg-color-input);
                border: none;
                border-radius: 15px;
                padding: 0 25px;
                margin: 5px;
                box-shadow: var(--shadow-input);
                width: 100%;
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
                  .val
                    text-overflow: ellipsis
                    white-space: nowrap
                    overflow: hidden
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
                  background: var(--bg-color-input)
                  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0,0,0,0.05)
                  cursor: pointer
                  div
                    width: 100%
                    height: 40px
                    display: flex
                    align-items: center
                    padding-left: 15px
                    color: var(--foreground-color-alt-transparent-low)
                  div:not(:last-child)
                    border-bottom: 1px solid var(--color-border)
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
                color: var(--main-color)
                padding: 0 30px
                border-radius: 25px
                transition: all .25s ease-in-out
              .btn.publish
                font-size: 20px
                border: 2px solid var(--main-color)
                color: var(--bg-color-1)
                background: var(--main-color)
                font-weight: bold
                margin-left: 10px
                box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.05);
              .btn.publish:hover
                color: var(--bg-color-1)
              .btn.cancel
                color: var(--foreground-color-alt)
                opacity: .7
                i.material-icons
                  color: var(--foreground-color-alt-transparent-low)
</style>
