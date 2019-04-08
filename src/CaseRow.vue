<template>
  <div>
    <ul class="case-row">
      <li>case-row</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CaseRow",
  props: {
    content: Object
  },
  created() {
    // console.log(this.content);
  }
};
</script>

<style lang="sass" scoped>
img
  display: block
  max-width: 100%
  height: auto
</style>
