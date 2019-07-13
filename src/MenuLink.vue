<template>
  <router-link class="menu__link t-h2" :to="to" @mouseenter.native="mouseenter">
    <slot></slot>
  </router-link>
</template>

<script>
import anime from 'animejs'
import charming from 'charming'
import { isTouchDevice } from '@/scripts/detect'

export default {
  name: 'MenuLink',
  props: {
    to: { type: [String, Object] }
  },
  mounted() {
    charming(this.$el)
  },
  methods: {
    mouseenter() {
      if (isTouchDevice()) return false

      const chars = this.$el.querySelectorAll('span')

      const tl = anime.timeline({
        targets: chars
      })

      tl.add({
        duration: 200,
        opacity: 0,
        translateY: '-10%',
        easing: 'easeInOutCubic'
      }).add(
        {
          duration: 600,
          delay: anime.stagger(40),
          easing: 'easeInOutSine',
          opacity: [0, 1],
          translateY: ['10%', '0%'],
          skewX: ['-5deg', '0deg']
        },
        '+=20'
      )
    }
  }
}
</script>

<style lang="sass" scoped>
.menu__link /deep/ span
  display: inline-block
  will-change: transform, opacity
</style>
