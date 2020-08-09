<template>
  <div>
      <topnavbar :logged=true></topnavbar>
      <profilecard id="profile"></profilecard>
  </div>
</template>

<script>
import profilecard from '~/components/profile/profile_card.vue'
import topnavbar from '../components/Navbar.vue'

export default {
  middleware: 'auth',
  components: {
    profilecard,
    topnavbar
  }
}
</script>

<style scoped>
@media screen and (min-width: 768px) {
  #profile {
    margin-top: 68px;
  }
}
@media screen and (max-width: 768px) {
  #profile {
    margin-bottom: 68px;
  }
}
</style>