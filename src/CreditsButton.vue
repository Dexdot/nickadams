<template>
  <button
    :class="['credits-btn', { visible }]"
    @click="$emit('credits-click')"
    type="button"
  >
    <span>Credits</span>
  </button>
</template>

<script>
import { isTouchDevice } from '@/scripts/detect'

export default {
  name: 'CreditsButton',
  data: () => ({
    visible: false,
    timeout: null
  }),
  mounted() {
    if (isTouchDevice()) this.visible = true
    window.addEventListener('mousemove', this.mousemove.bind(this))
  },
  destroyed() {
    window.removeEventListener('mousemove', this.mousemove.bind(this))
  },
  methods: {
    mousemove() {
      if (isTouchDevice()) return false
      this.visible = true

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.visible = false
      }, 500)
    }
  }
}
</script>

<style lang="sass" scoped>
.credits-btn
  position: fixed
  top: calc(var(--vh, 1vh) * 92)
  left: var(--unit)

.credits-btn
  transition: opacity 0.25s ease
  opacity: 0
  pointer-events: none

  @media (max-width: 500px)
    opacity: 1
    pointer-events: none

.credits-btn.visible
  opacity: 1
  pointer-events: auto
</style>
