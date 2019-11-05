<template>
  <img />
</template>

<script>
export default {
  name: 'ImageDecode',
  props: {
    src: {
      type: String
    }
  },
  mounted() {
    const img = this.$el.cloneNode(true)
    img.src = this.src

    img.decode().then(() => {
      this.$el.replaceWith(img)
      this.$emit('complete', img)
    })
  }
}
</script>
