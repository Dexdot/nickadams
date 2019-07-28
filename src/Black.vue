<template>
  <div v-if="$store.getters.blackCases.length > 0">
    <Main
      :isNextVisible="isNextVisible"
      :isDark="true"
      :scroll="scroll"
      :scrollDelta="scrollDelta"
      :isNotScrolling="isNotScrolling"
    />
    <Next
      @toggle-dark="$emit('toggle-dark', $event)"
      @intersect="onNextIntersect"
      @notintersect="onNextIntersect"
      to="/"
      :isDark="false"
      :pageDark="true"
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
    },
    isNotScrolling: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.$emit('toggle-dark', true)
  },
  methods: {
    onNextIntersect(entry) {
      this.isNextVisible = entry.intersectionRatio >= 0.3
    }
  }
}
</script>
