<template>
  <Main :isDark="true" :scroll="scroll" />
</template>

<script>
import Main from '@/Main.vue'

export default {
  name: 'Black',
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
    this.$emit('toggle-dark', true)
  }
}
</script>
