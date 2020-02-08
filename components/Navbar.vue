<template>
  <div>
    <nav
      :style="{
        background:
          this.semitransparent === true
            ? 'var(--foreground-color-alt-transparent)'
            : 'var(--bg-color-1)'
      }"
    >
      <div class="logo">
        <a
          href="/"
          :style="{
            color:
              this.semitransparent === true
                ? 'var(--bg-color-1)'
                : 'var(--main-color)'
          }"
          >Coreteca</a
        >
      </div>
      <div class="links">
        <div id="notlogged" v-if="!logged">
          <div class="login-btn"><a href="/login">Sign in</a></div>
          <div class="login-btn"><a href="/register">Sign up</a></div>
        </div>
        <div id="logged" v-if="logged">
          <div id="searchbox">
            <input
              @keyup="onQuery"
              v-model="query"
              placeholder="Busca un libro..."
              type="text"
              name="search"
              id="search"
            />
            <div class="filters">
              <i
                class="material-icons search-icon"
                @click="onQuery"
                :style="{
                  color:
                    this.query.length > 0
                      ? 'var(--foreground-color-alt)'
                      : 'var(--foreground-color-main)'
                }"
              >
                search
              </i>
              <div class="add" @click="openParamsMenu">
                <div
                  class="close-params"
                  :style="{ background: this.closeParamsOpacity }"
                  v-if="this.openParams"
                  @click.stop.prevent="openParamsMenu(true)"
                ></div>
                <div
                  @click.stop="
                    '';


                  "
                  id="params-menu"
                  class="params-container"
                  :class="{ open: this.openParams }"
                  :style="{ transform: this.translate }"
                >
                  <div class="spacer"></div>
                  <div class="name">Parámetros:</div>
                  <div class="params">
                    <div
                      @click="toggleParam(param)"
                      :style="{
                        opacity: param.active ? 1 : 0.8
                      }"
                      class="param"
                      v-bind:key="param.key"
                      v-for="param of this.params"
                    >
                      <div class="key">
                        {{ param.key }}
                      </div>
                      <i class="material-icons">
                        {{ !param.active ? "add" : "remove" }}
                      </i>
                    </div>
                  </div>
                </div>
                <i
                  class="material-icons"
                  :style="{
                    color:
                      this.params.filter(
                        param => param.active && param.key !== 'title'
                      ).length > 0
                        ? 'var(--foreground-color-alt)'
                        : 'var(--foreground-color-main-transparent)'
                  }"
                >
                  filter_list
                </i>
              </div>
              <div class="tags" v-for="param of params" v-bind:key="param.key">
                <div class="tag" v-if="param.active">
                  {{ param.key }}
                  <i @click="toggleParam(param)" class="material-icons">
                    close
                  </i>
                </div>
              </div>
            </div>
          </div>
          <div class="user-container">
            <div class="btn-user">
              <i class="material-icons">
                person
              </i>
            </div>
            <div class="spacer"></div>
            <div class="menu">
              <div class="items">
                <div class="item">
                  <a href="/upload"
                    ><i class="material-icons">cloud_upload</i>
                    <div class="text">Subir libro</div></a
                  >
                </div>
                <div class="item" @click="flipTheme">
                  <a>
                    <i class="material-icons">
                      {{ theme === "light" ? "nights_stay" : "wb_sunny" }}
                    </i>
                    <div class="text">
                      Modo
                      {{ theme === "light" ? "noche" : "día" }}
                    </div>
                  </a>
                </div>
                <div class="item" @click="signout">
                  <a
                    ><i class="material-icons">power_settings_new</i>
                    <div class="text">Cerrar sesión</div></a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { themeService } from "@/services/themeService";
export default {
  data() {
    return {
      theme: localStorage.getItem("theme") || "light",
      openParams: false,
      translate: "",
      closeParamsOpacity: 1,
      query: "",
      touchY: {
        i: 0,
        f: 0
      },
      gestureContainer: {},
      params: [
        {
          key: "title",
          active: false
        },
        {
          key: "author",
          active: false
        },
        {
          key: "synopsis",
          active: false
        },
        {
          key: "publisher",
          active: false
        },
        {
          key: "tags",
          active: false
        }
      ]
    };
  },

  methods: {
    async flipTheme() {
      const body = document.getElementsByTagName("body")[0];
      const bodyCopy = body.cloneNode(true);
      body.classList.add("tmp");
      bodyCopy.classList.add("tmp");
      bodyCopy.classList.add("copy");
      body.parentNode.append(bodyCopy);

      const theme = localStorage.getItem("theme");
      themeService.setTheme(theme === "dark" ? "light" : "dark");
      await this.delay(500);
      body.classList.remove("tmp");
      bodyCopy.remove();
    },
    delay: ms => new Promise(r => setTimeout(r, ms)),
    async openParamsMenu(close = false) {
      if (this.openParams || close === true) {
        this.translate = "translateY(calc(100% + 78px))";
        this.closeParamsOpacity = 0;
        await this.delay(250);
        this.openParams = false;
      } else {
        this.openParams = true;
      }
      this.closeParamsOpacity = 1;
      this.translate = "";
    },
    onQuery() {
      const searchData = { query: this.query, params: this.params };
      this.$emit("onSearch", searchData);
    },
    signout() {
      localStorage.removeItem("user-token");
      this.$router.push({
        path: "/login"
      });
    },
    toggleParam(param) {
      const index = this.params.findIndex(el => el.key === param.key);
      this.params[index].active = !this.params[index].active;
      const searchData = { query: this.query, params: this.params };
      this.$emit("onSearch", searchData);
    },
    async listenContainerGesture() {
      await this.delay(150);
      this.gestureContainer = document.getElementById("params-menu");
      this.gestureContainer.addEventListener(
        "touchstart",
        e => {
          this.touchY.i = e.targetTouches[0].screenY;
        },
        false
      );

      this.gestureContainer.addEventListener(
        "touchmove",
        async e => {
          this.touchY.f = e.changedTouches[0].screenY;
          await this.handleGesture(true);
        },
        false
      );
    },
    async handleGesture() {
      if (this.touchY.f > this.touchY.i) {
        const distance = this.touchY.f - this.touchY.i;
        if (distance > 35) {
          this.openParamsMenu(true);
        }
      }
    }
  },
  props: {
    logged: Boolean,
    semitransparent: Boolean
  },
  mounted() {
    this.listenContainerGesture();
  },
  created() {
    themeService.getTheme().subscribe(theme => (this.theme = theme));
  }
};
</script>

<style scoped lang="sass">
nav
  position: fixed
  height: 68px
  width: 100vw
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 5vw
  top: 0
  z-index: 50
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.05)


nav > .links > div
  display: flex
  justify-content: space-between

.logo > a
  font-size: 28px
  line-height: 30px
  text-transform: uppercase
  letter-spacing: 0.24px
  font-weight: bold

.login-btn
  padding: 5px 20px
  border: 1px solid white
  border-radius: 25px
  margin-left: 10px
  cursor: pointer

.login-btn > a
  color: var(--bg-color-1)

.login-btn > a:hover
  text-decoration: none
.btn-user::after
  content: '';
  display: block;
  height: 20px;
  width: 100%;
  position: absolute;
  bottom: -10px;
.btn-user
  height: 40px
  width: 40px
  background: var(--main-color)
  border-radius: 50%
  margin-left: 20px
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.05)
  i
    font-size: 32px
    color: var(--bg-color-input)


.user-container
  position: relative
  display: flex
  flex-direction: column
  justify-content: center
  .menu
    display: none
.user-container:hover
  .menu
    display: flex
    background: var(--bg-color-1)
    padding: 0 20px
    border-radius: 10px
    position: absolute
    width: max-content;
    box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.05)
    bottom: 0
    right: 0
    transform: translateY(calc(100% + 2.5px))
    .items
      width: 100%
      display: flex
      flex-direction: column
      justify-content: flex-start
      .item:not(:last-child)
        border-bottom: 1px solid var(--color-border)
      .item
        width: 100%
        display: flex
        justify-content: space-between
        align-items: center
        padding: 10px 0;
        a
          font-weight: bold
          display: flex
          justify-content: space-between
          align-items: center
          width: 100%
          text-decoration: none
          color: var(--foreground-color-alt-transparent-low);
          i
            margin-right: 15px



#searchbox
  width: calc(80vw - 200px)
  position: relative
  display: flex
  align-items: center

#searchbox > .filters
  position: absolute
  right: 20px
  display: flex
  flex-direction: row-reverse
  align-items: center


#searchbox > .filters > .search-icon
  margin-left: 10px
  opacity: 0.8
  cursor: pointer
  text-shadow: 3px 4px 6px rgba(0, 0, 0, 0.09), 2px -1px 6px rgba(0, 0, 0, 0.12)


.filters > .tags > .tag
  background: var(--bg-color-tag)
  color: var(--foreground-color-alt)
  display: flex
  padding: 2.5px 7.5px
  border-radius: 5px
  align-items: center
  font-size: 13px
  margin-right: 5px
  text-transform: capitalize
  transition: all 0.25s ease-in-out
  cursor: default
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.05)


.filters > .tags > .tag:hover
  background: var(--bg-color-tag-alt);


.filters > .tags > .tag > i
  padding-left: 5px
  font-size: 12px
  cursor: pointer

#searchbox .add
  border-radius: 5px
  display: flex
  align-items: center
  justify-content: space-between
  padding: 2.5px 10px
  cursor: pointer
  position: relative


#searchbox .add > div:not(.params-container)
  font-size: 13px
  text-transform: uppercase
  font-weight: 400


#searchbox .add > i
  opacity: 0.8
  text-shadow: 3px 4px 6px rgba(0, 0, 0, 0.09), 2px -1px 6px rgba(0, 0, 0, 0.12)


#searchbox .add > .params-container
  display: none
  padding: 20px
  position: absolute
  background: var(--bg-color-1)
  color: var(--foreground-color-main)


#searchbox .add > .params-container > .spacer
  width: 105px
  height: 20px
  position: absolute
  transform: translate(calc(50% - 20px), calc(-100% - 10px))


#searchbox .add:hover > .params-container,
#searchbox .add > .params-container:hover
  width: 300px
  display: flex
  justify-content: flex-start
  flex-direction: column
  min-height: 70px
  border-radius: 10px
  bottom: 0
  left: 0
  transform: translate(-25%, calc(100% + 5px))
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.03), 0 3px 6px rgba(0, 0, 0, 0.05)


#searchbox .add > .params-container > .name
  font-weight: bold
  font-size: 18px
  margin-bottom: 10px


#searchbox .add > .params-container > .params
  display: flex
  flex-wrap: wrap
  justify-content: flex-start


.params-container > .params > .param
  background: var(--main-color-alt)
  color: var(--main-color-alt-fg)
  cursor: pointer
  display: flex
  align-items: center
  justify-content: space-between
  padding: 5px 15px
  border-radius: 15px
  margin: 2px
  transition: all 0.25s ease-in-out
  font-size: 13px
  text-transform: capitalize


.params-container > .params > .param > i
  margin-left: 5px
  font-size: 14px


@media screen and(min-width: 768px)
  .params-container > .params > .param:hover
    opacity: 1 !important



input#search
  width: 100%
  height: 45px
  background: var(--bg-color-input-search);
  border: none
  border-radius: 15px
  padding: 0 25px
  box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.045), 0 3px 6px rgba(0, 0, 0, .075)

input#search:focus
  outline: none

@keyframes appear-in
  from
    transform: translateY(calc(100% + 78px))
  to
    transform: translateY(0)


@media screen and(max-width: 768px)
    nav
      bottom: 0
      top: unset
      justify-content: space-between
      .logo
          display: none
      .links
        width: 100%
      #logged
        width: 100%
        flex-direction: row-reverse
        .user-container
          .btn-user
            margin-left: 0
            margin-right: 20px
        .filters .tags
          display: none !important
        #searchbox
          width: 100%
          .close-params
            position: fixed
            height: 100vh
            top: 0
            left: 0
            opacity: 1
            width: 100vw
            transition: all .25s ease-in-out
            background: radial-gradient(#00000025, #00000050)

          .params-container:not(.open)
            display: none
          .params-container.open
            position: fixed
            width: 100vw
            bottom: 68px
            padding-bottom: 10vh
            padding-top: 5vh
            left: 0;
            transform: translate(0,0);
            animation: appear-in .25s ease-in-out
            transition: all .25s ease-in-out;
            z-index: 10
            touch-action: none
          .open::after
            width: 50vw
            left: 25%
            padding-left: 0
            height: 4px
            border-radius: 50px
            background: var(--foreground-color-alt-transparent)
            display: block
            content: ''
            position: absolute
            top: 2.5vh
</style>
