<template>
  <section class="background">
    <b-card 
      class="card">
      <h1 class="title">
        Coreteca
      </h1>
      <h2 class="subtitle">
        Biblioteca digital Core Dumped
      </h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green"
        >Documentation</a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >GitHub</a>
      </div>
    </b-card>
  
  </section>
</template>

<script>

export default {
  components: {
  },


  methods: {

        changePage(){
          console.log("Hey")
          this.$router.push({
              name: 'patata',
              params: { name: 'world' }
          })
        }
  }
}
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.7); 
  padding: 15px;
}
.background {
  margin: 0 auto !important;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: url('~@/assets/book.png');
  background-size:     cover;
  background-repeat:   no-repeat;
  background-position: center center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  /*font-weight: 300;*/
  font-size: 8vw;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
