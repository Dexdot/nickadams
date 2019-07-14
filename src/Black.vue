<template>
  <div>
    <Main :isDark="true" :scroll="scroll" />
    <Next to="/" :isLight="true">
      <span slot="title">There will be light</span>
      <span slot="text"
        >Jamie then returned home to set up his own product
      </span>
    </Next>
  </div>
</template>

<script>
import Main from '@/Main.vue'
import Next from '@/Next'

export default {
  name: 'Black',
  components: {
    Main,
    Next
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
