<template>
  <Main :isDark="false" :scroll="scroll" />
</template>

<script>
import Main from '@/Main.vue'

export default {
  name: 'Index',
  components: {
    Main
  },
  props: {
    scroll: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.$emit('toggle-dark', false)
  }
}
</script>
