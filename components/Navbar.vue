<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="success">
    <b-navbar-brand href="/">NavBar</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-if="logged">
        <b-nav-item href="/bookcatalogue">Catalogue</b-nav-item>
        <b-nav-item href="/search">Search Book</b-nav-item>
        <b-nav-item href="/upload">Upload</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto" >
          <b-button v-if="!logged" class="mybutton" variant="outline-light" to="/login">Sign In</b-button>
          <b-button v-if="!logged" class="mybutton" variant="outline-light" to="/register">Register</b-button>
          <b-button v-if="logged" class="mybutton" variant="danger" @click="signout">Sign Out</b-button>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
import axios from 'axios';
import book from '~/components/media/Book2.vue'

export default { 
  data() {
    return {
      accessible: false
    }
  },

  methods: {
    signout() {
      localStorage.removeItem("user-token")
      this.$router.push({
        path: "/login"
      });
    }
  },

  props: {
    logged: Boolean
  }
}
</script>

<style scoped>
  .mybutton {
    margin: 0px 10px;
  }
</style>