<template>
  <div v-if="$store.getters.blackCases.length > 0">
    <Main
      :isNextVisible="isNextVisible"
      :isDark="true"
      :scroll="scroll"
      :scrollDelta="scrollDelta"
    />
    <Next
      @visible="isNextVisible = true"
      @invisible="isNextVisible = false"
      to="/"
      :isLight="true"
    >
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
    this.$emit('toggle-dark', true)
  }
}
</script>
