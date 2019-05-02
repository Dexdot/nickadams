<template>
  <div class="scroll-container" ref="container">
    <div
      class="scroll-inner"
      ref="inner"
      :style="{ transform: `translate3d(0, -${this.translate}px, 0)` }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import VirtualScroll from 'virtual-scroll'
import inobounce from 'inobounce'
import Raf from 'raf-engine'

const roundDec = n => Math.round(n * 100) / 100
const lerp = (a, b, n) => (1 - n) * a + n * b

const loop = new Raf()

export default {
  name: 'Scroll',
  data: () => ({
    scroll: 0,
    translate: 0,
    vs: null
  }),
  mounted() {
    loop.start()

    this.vs = new VirtualScroll({
      mouseMultiplier: 0.8,
      touchMultiplier: 4,
      passive: true
    })

    this.vs.on(e => {
      const scroll = this.scroll + -1 * e.deltaY

      this.scroll = Math.min(
        Math.max(scroll, 0),
        this.$refs.inner.getBoundingClientRect().height - window.innerHeight
      )
    })

    loop.add(this.checkSmooth.bind(this), 'checkSmooth')

    inobounce.enable()
  },
  methods: {
    checkSmooth() {
      if (Math.round(this.scroll) !== Math.round(this.translate)) {
        this.translate = roundDec(lerp(this.translate, this.scroll, 0.03))
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.scroll-container
  width: 100vw
  height: 100vh
  overflow: hidden
</style>
