<template>
  <div>
    <!--
  <b-navbar toggleable="lg" type="dark" variant="success">
    <b-navbar-brand href="/">Coreteca</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-if="logged">
        <b-nav-item href="/bookcatalogue">Catalogue</b-nav-item>
        <b-nav-item href="/search">Search Book</b-nav-item>
        <b-nav-item href="/upload">Upload</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto" >
          <b-button v-if="!logged" class="mybutton" variant="outline-light" to="/login">Sign In</b-button>
          <b-button v-if="!logged" class="mybutton" variant="outline-light" to="/register">Sign up</b-button>
          <b-button v-if="logged" class="mybutton" variant="danger" @click="signout">Sign Out</b-button>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
      -->
    <nav
      :style="{
        background: this.semitransparent === true ? '#00000040' : 'white'
      }"
    >
      <div class="logo">
        <a
          href="/"
          :style="{
            color: this.semitransparent === true ? 'white' : '#0d860f'
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
              placeholder="Busca un libro..."
              type="text"
              name="search"
              id="search"
            />
            <div class="filters">
              <i class="material-icons search-icon">
                search
              </i>
              <div class="add">
                <div class="params-container">
                  <div class="spacer"></div>
                  <div class="name">Parámetros:</div>
                  <div class="params">
                    <div
                      @click="toggleParam(param)"
                      :style="{
                        background: param.active ? '#0d860f' : '#0d860fb3'
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
                <div>Filtros</div>
                <i class="material-icons">
                  more_horiz
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
import axios from "axios";
import book from "~/components/media/Book2.vue";

export default {
  data() {
    return {
      accessible: false,
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
    signout() {
      localStorage.removeItem("user-token");
      this.$router.push({
        path: "/login"
      });
    },
    toggleParam(param) {
      const index = this.params.findIndex(el => el.key === param.key);
      this.params[index].active = !this.params[index].active;
    }
  },
  props: {
    logged: Boolean,
    semitransparent: Boolean
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
  color: white

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
  background: #0d860f
  border-radius: 50%
  margin-left: 20px
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer
  i
    font-size: 32px
    color: #e6e6e6


.user-container
  position: relative
  display: flex
  flex-direction: column
  .menu
    display: none
.user-container:hover
  .menu
    display: flex
    background: white
    padding: 10px 20px
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
      .item
        width: 100%
        display: flex
        justify-content: space-between
        align-items: center
        padding: 5px 0;
        a
          display: flex
          justify-content: space-between
          align-items: center
          width: 100%
          text-decoration: none
          color: #000000cf
          font-weight: bold
          color: #000000dd
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


.filters > .tags > .tag
  background: #0d860fcc
  color: white
  display: flex
  padding: 2.5px 7.5px
  border-radius: 5px
  align-items: center
  font-size: 13px
  margin-right: 5px
  text-transform: capitalize
  transition: all 0.25s ease-in-out
  cursor: default

.filters > .tags > .tag:hover
  background: #0d860f


.filters > .tags > .tag > i
  padding-left: 5px
  font-size: 12px
  cursor: pointer

#searchbox .add
  background: #00000025
  border-radius: 5px
  width: min-content
  display: flex
  align-items: center
  justify-content: space-between
  padding: 2.5px 10px
  min-width: 100px
  cursor: pointer
  position: relative


#searchbox .add > div:not(.params-container)
  font-size: 13px
  text-transform: uppercase
  font-weight: 400


#searchbox .add > i
  opacity: 0.8
  margin-left: 10px


#searchbox .add > .params-container
  display: none
  padding: 20px
  position: absolute


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
  background: white
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
  background: #0d870fb3
  color: white
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


.params-container > .params > .param:hover
  background: #0d860f !important


input#search
  width: 100%
  height: 45px
  background: #e6e6e6
  border: none
  border-radius: 15px
  padding: 0 25px


input#search:focus
  outline: none
</style>
