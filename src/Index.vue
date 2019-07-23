<template>
  <div v-if="$store.getters.mainCases.length > 0">
    <Main
      :isNextVisible="isNextVisible"
      :isDark="false"
      :scroll="scroll"
      :scrollDelta="scrollDelta"
    />
    <Next
      @visible="isNextVisible = true"
      @invisible="isNextVisible = false"
      to="/about"
    >
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
  data: () => ({
    isNextVisible: false
  }),
  props: {
    scroll: {
      type: Number,
      default: 0
    },
    scrollDelta: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.$emit('toggle-dark', false)
  }
}
</script>
