<template>
  <component :is="type" :href="href" class="button">
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: null,
    },
    to: {
      type: String,
      default: null,
    },
  },
  computed: {
    type() {
      if (this.href) {
        return "nuxt-link";
      } else {
        return "button";
      }
    },
  },
};
</script>
