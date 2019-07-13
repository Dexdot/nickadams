<template>
  <div>
    <Main :isDark="false" :scroll="scroll" />
    <Next to="/about">
      <span slot="title">About</span>
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
  name: 'Index',
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
    this.$emit('toggle-dark', false)
  }
}
</script>
