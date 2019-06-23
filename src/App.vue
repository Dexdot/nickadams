<template>
  <div id="app" class="page">
    <Header :dark="isDark" />

    <div class="scroll-container" ref="container">
      <div
        class="scroll-inner"
        ref="inner"
        :style="{ transform: `translate3d(0, -${this.translate}px, 0)` }"
      >
        <router-view :scroll="translate" @toggle-dark="onToggle" />
      </div>
    </div>
  </div>
</template>

<script>
import VirtualScroll from 'virtual-scroll'
import inobounce from 'inobounce'
import loop from '@/scripts/loop'
import Header from '@/Header'

const roundDec = n => Math.round(n * 100) / 100
const lerp = (a, b, n) => (1 - n) * a + n * b

export default {
  name: 'App',
  components: {
    Header
  },
  data: () => ({
    isDark: false,
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

    this.vs.on(this.onScroll)
    loop.add(this.checkSmooth.bind(this), 'checkSmooth')

    inobounce.enable()
  },
  destroyed() {
    this.vs.off(this.onScroll)
    loop.remove(this.checkSmooth.bind(this), 'checkSmooth')
  },
  methods: {
    onToggle(isDark) {
      this.isDark = isDark
    },
    onScroll(e) {
      const scroll = this.scroll + -1 * e.deltaY

      this.scroll = Math.min(
        Math.max(scroll, 0),
        this.$refs.inner.getBoundingClientRect().height - window.innerHeight
      )
    },
    checkSmooth() {
      if (Math.round(this.scroll) !== Math.round(this.translate)) {
        this.translate = roundDec(lerp(this.translate, this.scroll, 0.03))
      }
    }
  },
  watch: {
    $route() {
      this.scroll = 0
    }
  }
}
</script>

<style lang="sass">
\:root
  --color-text-lt: #1F2020
  --color-bg-lt: #EDECED

  --color-text-dk: #FFFFFF
  --color-bg-dk: #000000
</style>

<style lang="sass" scoped>
.page
  color: var(--color-text-lt)
  background: var(--color-bg-lt)

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text-lt)

.scroll-container
  width: 100vw
  height: 100vh
  overflow: hidden
</style>
