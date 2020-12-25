<template>
  <div class="wrapper">
    <ClientOnly>
      <h2>Markdown</h2>
      <TuiEditor mode="markdown" preview-style="vertical" height="300px" />

      <h2>WYSIWYG</h2>
      <TuiEditor mode="wysiwyg" height="300px" />
    </ClientOnly>
  </div>
</template>

<style>
.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>

<script>
export default {
  components: {
    // Editor,
  },
  data() {
    return {
      editorContent: "<h1>Editor contents</h1>",
    };
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
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
