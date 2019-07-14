<template>
  <div id="app" :class="['page', { dark: isDark }]">
    <Header
      :dark="isDark"
      :isHeaderActive="isHeaderActive"
      @menu-btn-click="toggleMenu"
    />
    <Menu :active="isMenuActive" />
    <Credits :active="isCreditsActive" />

    <div class="scroll-container" ref="container">
      <div
        class="scroll-inner"
        ref="inner"
        :style="{ transform: `translate3d(0, -${this.translate}px, 0)` }"
      >
        <transition @enter="enter" @leave="leave" :css="false" mode="out-in">
          <router-view
            :scroll="translate"
            @credits-click="onCreditsBtnClick"
            @toggle-dark="onToggle"
          />
        </transition>
      </div>
    </div>

    <div class="transition-cover" ref="cover"></div>
  </div>
</template>

<script>
import VirtualScroll from 'virtual-scroll'
import inobounce from 'inobounce'
import Header from '@/Header'
import Menu from '@/Menu'
import Credits from '@/Credits'

import loop from '@/scripts/loop'
import { isSafari } from '@/scripts/detect'

import transitions from '@/transitions/'

const roundDec = n => Math.round(n * 100) / 100
const lerp = (a, b, n) => (1 - n) * a + n * b
let isDark

export default {
  name: 'App',
  components: {
    Header,
    Menu,
    Credits
  },
  data: () => ({
    isHeaderActive: false,
    isMenuActive: false,
    isCreditsActive: false,
    isDark: false,
    scroll: 0,
    translate: 0,
    vs: null,
    winHeight: 0,
    dir: {}
  }),
  mounted() {
    // Window height
    this.getWinHeight()
    window.addEventListener('resize', this.getWinHeight.bind(this))

    // Start RAF
    loop.start()

    // On Scroll
    this.vs = new VirtualScroll({
      mouseMultiplier: 0.8,
      touchMultiplier: 4,
      passive: true
    })

    if (isSafari()) {
      window.addEventListener('scroll', this.scrollSafari.bind(this))
    } else {
      this.vs.on(this.onScroll)
      loop.add(this.checkSmooth.bind(this), 'checkSmooth')
    }

    // Start Inobounce
    inobounce.enable()
  },
  destroyed() {
    window.removeEventListener('resize', this.getWinHeight.bind(this))

    if (isSafari()) {
      window.removeEventListener('scroll', this.scrollSafari.bind(this))
    } else {
      this.vs.off(this.onScroll)
      loop.remove(this.checkSmooth.bind(this), 'checkSmooth')
    }
  },
  methods: {
    getWinHeight() {
      this.winHeight = window.innerHeight
    },
    toggleMenu() {
      if (this.isCreditsActive) {
        // Credits close
        this.isCreditsActive = false
        this.isHeaderActive = false
      } else {
        // Menu toggle
        if (!this.isMenuActive) isDark = this.isDark

        this.isMenuActive = !this.isMenuActive
        this.isHeaderActive = this.isMenuActive
        this.isDark = this.isMenuActive ? this.isMenuActive : isDark
      }
    },
    onCreditsBtnClick() {
      // Credits open
      this.isCreditsActive = true
      this.isHeaderActive = true
    },
    onToggle(v) {
      this.isDark = v
    },
    onScroll({ deltaY }) {
      const scroll = this.scroll + -1 * deltaY

      this.scroll = Math.min(
        Math.max(scroll, 0),
        this.$refs.inner.getBoundingClientRect().height - this.winHeight
      )
    },
    checkSmooth() {
      if (Math.round(this.scroll) !== Math.round(this.translate)) {
        this.translate = roundDec(lerp(this.translate, this.scroll, 0.03))
      }
    },
    scrollSafari() {
      this.scroll = window.pageYOffset
    },
    async enter(el, done) {
      await transitions[this.dir.to.name].enter(el)
      done()
    },
    async leave(el, done) {
      // const cover = this.$refs.cover

      if (this.isMenuActive) this.toggleMenu()

      await transitions[this.dir.from.name].leave(el)
      // await transitions['cover'].enter(cover)

      this.scroll = 0
      this.translate = 0

      // await transitions['cover'].leave(cover)
      done()
    }
  },
  watch: {
    $route(to, from) {
      this.dir = { to, from }
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
// .page
  // color: var(--color-text-lt)
  // background: var(--color-bg-lt)

  // /deep/ a
  //   &,
  //   &:visited,
  //   &:active,
  //   &:focus
  //     color: var(--color-text-lt)

.page:not(.dark)
  transition: background 0.5s ease-in-out

  color: var(--color-text-lt)
  background: var(--color-bg-lt)

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text-lt)

.page.dark
  transition: background 0.5s ease-in-out

  color: var(--color-text-dk)
  background: var(--color-bg-dk)

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text-dk)

.scroll-container
  width: 100vw
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)
  overflow: hidden

.transition-cover
  position: fixed
  top: 0
  left: 0

  width: 100vw
  height: 100vh
  // background: var(--color-bg-lt)
  background: #000

  // opacity: 0
  // pointer-events: none
  transform: translateY(101%)
</style>
