<template>
  <div id="app" :class="['page', { dark: isDark }]">
    <Header
      :dark="isDark"
      :isHeaderActive="isHeaderActive"
      :isHeaderVisible="isNotScrolling"
      @menu-btn-click="toggleMenu"
    />
    <Menu :active="isMenuActive" />
    <Credits :active="isCreditsActive" @credits-close="toggleCredits(false)" />
    <Stories
      :project="storiesPayload"
      :active="isStoriesActive"
      @click="isStoriesActive = false"
    />

    <div class="scroll-container" ref="container">
      <div class="scroll-inner" ref="inner" :style="scrollStyle">
        <transition @enter="enter" @leave="leave" :css="false" mode="out-in">
          <router-view
            :key="$route.path"
            :scrollDelta="deltaY"
            :scroll="getTranslate()"
            :isNotScrolling="isNotScrolling"
            @credits-click="toggleCredits(true)"
            @toggle-dark="onToggle"
            @show-stories="showStories"
          />
        </transition>
      </div>
    </div>

    <div class="cover"></div>
  </div>
</template>

<script>
import VirtualScroll from 'virtual-scroll'
import Header from '@/Header'
import Menu from '@/Menu'
import Credits from '@/Credits'
import Stories from '@/Stories'

import loop from '@/scripts/loop'
import { isMobileDevice, isSafari, isMACOS } from '@/scripts/detect'

import transitions from '@/transitions/'

const onEscape = function({ keyCode }) {
  if (keyCode === 27) this.isStoriesActive = false
}

const roundDec = n => Math.round(n * 100) / 100
const lerp = (a, b, n) => (1 - n) * a + n * b

let isDark
let timer

export default {
  name: 'App',
  components: {
    Header,
    Menu,
    Credits,
    Stories
  },
  computed: {
    scrollStyle() {
      return isSafari() || isMobileDevice()
        ? {}
        : { transform: `translate3d(0, -${this.translate}px, 0)` }
    },
    disableScroll() {
      return this.isMenuActive || this.isCreditsActive || this.isStoriesActive
    }
  },
  data: () => ({
    storiesPayload: {},
    isStoriesActive: false,
    isNotScrolling: true,
    isHeaderActive: false,
    isMenuActive: false,
    isCreditsActive: false,
    isDark: false,
    scroll: 0,
    translate: 0,
    deltaY: 0,
    vs: null,
    winHeight: 0,
    dir: {}
  }),
  mounted() {
    if (isMACOS()) {
      document.querySelector('body').classList.add('is-macos')
    }
    if (isSafari()) {
      document.querySelector('body').classList.add('is-safari')
    }
    if (isMobileDevice()) {
      document.querySelector('body').classList.add('is-mob')
    }

    // Window height
    this.getWinHeight()
    window.addEventListener('resize', this.getWinHeight.bind(this))

    // Start RAF
    loop.start()

    // On Scroll
    this.vs = new VirtualScroll({
      firefoxMultiplier: 25,
      mouseMultiplier: 0.8,
      touchMultiplier: 4,
      passive: true
    })

    if (isSafari() || isMobileDevice()) {
      window.addEventListener('scroll', this.scrollSafari.bind(this))
      this.checkScrollStop()
    } else {
      this.vs.on(this.onScroll)
      loop.add(this.checkSmooth.bind(this), 'checkSmooth')
    }
  },
  methods: {
    getTranslate() {
      return isSafari() || isMobileDevice() ? this.scroll : this.translate
    },
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
    toggleCredits(show) {
      // Credits open
      this.isCreditsActive = show
      this.isHeaderActive = show
    },
    onToggle(v) {
      this.isDark = v
    },
    showStories(payload) {
      this.storiesPayload = payload
      this.isStoriesActive = true
    },
    onScroll({ deltaY }) {
      const innerHeight = this.$refs.inner.scrollHeight
      if (this.disableScroll || innerHeight === this.winHeight) return false

      if (!this.isMenuActive && !this.isCreditsActive) {
        clearTimeout(timer)
        this.isNotScrolling = false
      }

      this.deltaY = deltaY
      const scroll = this.scroll + -1 * deltaY

      this.scroll = Math.min(
        Math.max(scroll, 0),
        innerHeight - this.winHeight
        // this.$refs.inner.getBoundingClientRect().height - this.winHeight
      )
    },
    checkSmooth() {
      const roundTranslate = Math.round(this.translate)
      const roundScroll = Math.round(this.scroll)

      if (roundScroll !== roundTranslate) {
        this.translate = roundDec(lerp(this.translate, this.scroll, 0.03))

        // Round scroll (chrome transform bluring)
        // Show header after scroll stops

        if (this.isNotScrolling) clearTimeout(timer)

        if (
          roundTranslate >= roundScroll - 1 &&
          roundTranslate <= roundScroll + 1
        ) {
          this.translate = Math.round(lerp(this.translate, this.scroll, 0.03))

          timer = setTimeout(() => {
            this.isNotScrolling = true
          }, 1200)
        } else {
          clearTimeout(timer)
          this.isNotScrolling = false
        }
      }
    },
    scrollSafari(e) {
      if (this.disableScroll) return false

      this.deltaY = e.deltaY
      this.scroll = window.pageYOffset
    },
    checkScrollStop() {
      window.addEventListener('scroll', () => {
        this.isNotScrolling = false
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.isNotScrolling = true
        }, 250)
      })
    },
    async enter(el, done) {
      const transitionEnter =
        this.dir.from.name === this.dir.to.name ? 'cases' : this.dir.to.name
      await transitions[transitionEnter].enter(el)

      done()
    },
    async leave(el, done) {
      const delay = this.isMenuActive || this.isCreditsActive ? 600 : 0
      if (this.isMenuActive || this.isCreditsActive) this.toggleMenu()

      // timeout - menu transition-duration
      setTimeout(async () => {
        const transitionLeave =
          this.dir.from.name === this.dir.to.name ? 'cases' : this.dir.from.name
        await transitions[transitionLeave].leave(el)

        this.scroll = 0
        this.translate = 0
        window.scrollTo(0, 0)

        done()
      }, delay)
    }
  },
  watch: {
    $route(to, from) {
      this.dir = { to, from }
    },
    isStoriesActive(v) {
      if (v) {
        window.addEventListener('keydown', onEscape.bind(this))
      } else {
        window.removeEventListener('keydown', onEscape.bind(this))
      }
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

body.is-macos:not(.is-safari)
  overflow: hidden

.is-mob,
.is-safari
  .scroll-container
    width: auto !important
    height: auto !important
    overflow: unset !important
</style>

<style lang="sass" scoped>
.page--white .page:not(.dark)
  background: #fff

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

.cover
  position: fixed
  top: 0
  left: 0

  width: 100vw
  height: 100vh

  background: #fff
  transform: translateY(100%)
</style>
