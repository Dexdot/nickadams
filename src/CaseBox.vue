<template>
  <div>
    <ul class="case-box">
      <li
        class="u-center"
        v-for="img in content.images"
        :key="img.fields.file.url"
        :style="{ backgroundColor : content.color || '#DDDDDD' }"
      >
        <img
          :src="img.fields.file.url"
          :alt="img.fields.title"
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CaseBox",
  props: {
    content: Object
  },
  created() {
    console.log({ ...this.content });
  }
};
</script>

<style lang="sass" scoped>
li
  padding: 10.4% 12.7%

img
  display: block
  max-width: 100%
  height: auto

  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.15)
</style>
