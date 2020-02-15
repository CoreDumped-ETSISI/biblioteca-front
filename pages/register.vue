<template>
  <div>
      <topnavbar :logged=false></topnavbar>
      <RegisterForm></RegisterForm>
  </div>
</template>

<script>
import RegisterForm from '~/components/RegisterForm.vue'
import topnavbar from '../components/Navbar.vue'

export default {
  middleware: 'isNotLogged',
  components: {
    RegisterForm,
    topnavbar
  }
}
</script>

<style scoped>
</style>