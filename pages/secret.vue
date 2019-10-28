<template>
  <div>
    <h1>This is a secret page</h1>
  </div>
</template>


<script>
export default {
  middleware: 'auth'
}
</script>