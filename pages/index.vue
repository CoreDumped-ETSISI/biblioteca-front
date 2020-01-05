<template>
  <div>
    <topnavbar :logged=false></topnavbar>
    <section class="background">
      <b-card 
        class="card">
        <h1 class="title">
          Coreteca
        </h1>
        <h2 class="subtitle">
          Biblioteca digital Core Dumped
        </h2>
      </b-card>
    
    </section>
  </div>
</template>

<script>
import topnavbar from '../components/Navbar.vue'

export default {
  middleware: 'isNotLogged',
  components: {
    topnavbar
  },
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
  background-image: url('~@/assets/book.PNG');
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
