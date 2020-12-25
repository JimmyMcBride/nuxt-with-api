<template>
  <div :style="boxStyles" class="button" :class="{ dark: dark }">
    <slot />
  </div>
</template>

<style>
.button {
  background: red;
}
.dark {
  background: blue;
}
</style>

<script>
export default {
  props: {
    dark: {
      type: Boolean,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    flex: {
      type: Boolean,
      default: null,
    },
    grid: {
      type: Boolean,
      default: null,
    },
    stretch: {
      type: Boolean,
      default: null,
    },
    w: {
      type: String,
      default: null,
    },
  },
  computed: {
    boxStyles() {
      return {
        display: this.flex ? "flex" : this.grid ? "grid" : "block",
        "justify-content": "flex-end",
        width: this.stretch ? "100%" : this.w ? this.w : "auto",
      };
    },
  },
};
</script>
