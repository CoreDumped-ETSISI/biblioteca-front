<style lang="sass" scoped>
.popup-box
    max-width: 33vw
    max-height: 200px
    box-shadow: var(--shadow-tag)
    border-radius: 10px 5px 5px 10px
    display: none
    flex-direction: row-reverse
    align-items: center
    border-right: 7.5px crimson solid
    margin: 0 25px 50px
    position: fixed
    right: 0
    top: 93px
    padding: 10px 0 10px 15px
    animation: appear .25s ease-in-out
    transition: all .25s ease-in-out
    background: var(--bg-color-input)
    color: var(--foreground-color-main)
    .message
        display: flex
        flex-direction: column
        justify-conter: center
        .msg
            font-size: 18px
            font-weight: bold
        .subtitle
            opacity: .8
    .icon
        display: flex
        align-items: center
        i
            font-size: 36px
            margin: 0 15px
            color: crimson
@keyframes appear
    from
        transform: translateX(calc(100% + 20px))
    to
        transform: translateX(0)
</style>
<template>
  <div class="popup-box" :style="this.animation">
    <div class="icon">
      <i class="material-icons">error_outline</i>
    </div>
    <div class="message">
      <div class="msg">{{ popup.title }}</div>
      <div class="subtitle">{{ popup.subtitle }}</div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    async initPopup() {
      this.animation = {
        display: "flex"
      };
      await this.delay(this.popup.duration + 250);
      this.animation = {
        transform: "translateX(calc(100% + 25px))",
        display: "flex"
      };
      await this.delay(250);
      this.animation = {
        display: "none"
      };
      this.$emit("finished", true);
    },
    delay(ms) {
      return new Promise(res => setTimeout(res, ms));
    }
  },
  props: {
    popup: Object
  },
  beforeMount() {
    this.initPopup();
  },
  data() {
    return {
      animation: {
        display: "none"
      }
    };
  }
};
</script>
