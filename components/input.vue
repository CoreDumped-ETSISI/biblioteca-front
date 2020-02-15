<script>
export default {
  props: {
    value: String | Number,
    type: String,
    placeholder: String,
    css: Object
  },
  methods: {
    onChange: e => {
      console.log(1);
      console.log(e);
    }
  },
  data() {
    return {
      val: this.value
    };
  },
  watch: {
    val(value, oldValue) {
      this.$emit("val", value);
    }
  }
};
</script>
<template>
  <div>
    <input
      v-if="type !== 'textarea'"
      v-model="val"
      :type="type"
      :placeholder="placeholder"
      :style="css"
    />
    <textarea
      v-if="type === 'textarea'"
      v-model="val"
      :placeholder="placeholder"
      :style="css"
    />
  </div>
</template>
<style lang="scss" scoped>
input,
textarea {
  color: var(--foreground-color-main);
  background: var(--bg-color-input);
  border: none;
  border-radius: 15px;
  padding: 0 25px;
  margin: 5px;
  box-shadow: var(--shadow-input);
  width: 100%;
}
input {
  height: 45px;
}
textarea {
  resize: none;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: var(--bg-color-input-search);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--foreground-color-alt-transparent);
  }
}
textarea {
  font-size: 18px;
  margin-top: 10px;
  min-height: 120px;
  padding: 10px 25px;
}
input:focus,
textarea:focus {
  outline: none;
}
</style>
