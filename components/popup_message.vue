<style lang="scss" scoped>
.popup-box {
  max-width: 33vw;
  max-height: 200px;
  box-shadow: var(--shadow-tag);
  border-radius: 10px 5px 5px 10px;
  display: none;
  flex-direction: row-reverse;
  align-items: center;
  margin: 0 25px 50px;
  position: fixed;
  right: 0;
  top: 93px;
  padding: 10px 0 10px 15px;
  animation: appear 0.25s ease-in-out;
  transition: all 0.25s ease-in-out;
  background: var(--bg-color-input);
  color: var(--foreground-color-main);

  --success: #00ff55;
  --error: crimson;
  --warning: goldenrod;

  & .message {
    display: flex;
    flex-direction: column;
    justify-content: center;

    & .msg {
      font-size: 18px;
      font-weight: bold;
    }

    & .subtitle {
      opacity: 0.8;
    }
  }

  & .icon {
    display: flex;
    align-items: center;

    & i {
      font-size: 36px;
      margin: 0 15px;
    }
  }
}

@keyframes appear {
  from {
    transform: translateX(calc(100% + 20px));
  }

  to {
    transform: translateX(0);
  }
}
</style>
<template>
  <div
    :style="{
      'border-right': '7.5px solid var(--' + getColor() + ')',
      ...this.animation
    }"
    class="popup-box"
  >
    <div class="icon">
      <i :style="{ color: `var(--${getColor()})` }" class="material-icons">{{
        getIcon()
      }}</i>
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
    getColor() {
      return this.popup.type;
    },
    getIcon() {
      if (this.popup.type === "error") {
        return "error_outline";
      } else if (this.popup.type === "warning") {
        return "warning";
      } else if (this.popup.type === "success") {
        return "check";
      }
    },
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
