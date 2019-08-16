<template>
  <main class="main">
    <h1
      v-if="isDesktop"
      :class="['main-title', 't-h1', { soon: isSoon }]"
      :style="{ transform: `translate3d(-50%, ${this.scroll}px, 0)` }"
      ref="title"
    ></h1>
    <h1
      v-show="!isNextVisible"
      v-else
      :class="['main-title-mob', 't-h1', { soon: isSoon }]"
      :style="{ transform: `translate3d(-50%, ${this.scroll}px, 0)` }"
      ref="title-mob"
    >
      {{ titleMob }}
    </h1>

    <ul class="cases">
      <li
        :class="['case', { 'case--soon': project.soon }]"
        ref="cases"
        :data-title="project.title"
        v-for="project in cases"
        :key="project.slug"
      >
        <ul>
          <li
            v-for="(img, i) in project.covers"
            :key="img.fields.file.fileName"
          >
            <span
              v-if="project.soon"
              class="img"
              @mouseover="mouseover(project, i)"
              @mouseout="mouseout"
            >
              <div class="img__i">
                <video
                  v-if="img.fields.type === 'video'"
                  autoplay
                  playsinline
                  loop
                  muted
                >
                  <source
                    :src="img.fields.file.url"
                    :type="img.fields.contentType"
                  />
                </video>

                <img
                  v-if="img.fields.type === 'image'"
                  :src="img.fields.file.url"
                  :alt="project.title"
                />
              </div>
            </span>
            <router-link
              v-else
              class="img"
              :to="`/case/${project.slug}`"
              @mouseover.native="mouseover(project, i)"
              @mouseout.native="mouseout"
            >
              <div class="img__i">
                <video
                  v-if="img.fields.type === 'video'"
                  autoplay
                  playsinline
                  loop
                  muted
                >
                  <source
                    :src="img.fields.file.url"
                    :type="img.fields.contentType"
                  />
                </video>

                <img
                  v-if="img.fields.type === 'image'"
                  :src="img.fields.file.url"
                  :alt="project.title"
                />
              </div>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>

    <router-link style="display: block" :to="isDark ? '/' : '/black'">
      <Toggler
        :isNotScrolling="isNotScrolling"
        :isDark="isDark"
        :style="{ transform: `translate3d(0, ${this.scroll}px, 0)` }"
      />
    </router-link>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

import anime from 'animejs'
import charming from 'charming'
import Toggler from '@/Toggler'

export default {
  name: 'Main',
  components: {
    Toggler
  },
  props: {
    scroll: {
      type: Number,
      default: 0
    },
    scrollDelta: {
      type: Number,
      default: 0
    },
    isDark: {
      type: Boolean,
      default: false
    },
    isNextVisible: {
      type: Boolean,
      default: false
    },
    isNotScrolling: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    chars: [],
    titleMob: '',
    isSoon: false
  }),
  computed: {
    ...mapGetters(['blackCases', 'mainCases']),
    cases() {
      return this.isDark ? this.blackCases : this.mainCases
    },
    isDesktop: () => window.innerWidth > 500
  },
  mounted() {
    this.observeCases()
  },
  methods: {
    observeCases() {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            // Hide title if case is not visible
            if (
              !entry.isIntersecting &&
              entry.target.dataset.title === this.title
            ) {
              this.showTitle(false)
            }

            // Set mobile title text
            const dir = this.scrollDelta > 0 ? 'up' : 'down'
            const scrollCondition =
              dir === 'down'
                ? entry.target.getBoundingClientRect().top >= innerHeight / 2
                : entry.target.getBoundingClientRect().top <= innerHeight / 2.5
            if (entry.intersectionRatio >= 0.8 && scrollCondition) {
              if (window.innerWidth <= 500)
                this.isSoon = entry.target.classList.contains('case--soon')
              this.titleMob = entry.target.dataset.title
            }
          })
        },
        { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
      )
      this.$refs.cases.forEach(v => {
        observer.observe(v)
      })
    },
    mouseover(project) {
      if (!this.$refs.title) return false

      const { title, soon } = project

      this.title = title
      this.isSoon = soon
      this.$refs.title.innerHTML = title
      charming(this.$refs.title)
      this.showTitle()
    },
    mouseout() {
      this.showTitle(false)
    },
    showTitle(show = true, cb) {
      const { title } = this.$refs

      if (!title) return false
      const chars = title.querySelectorAll('span')

      if (!show) this.isSoon = false

      anime.remove(chars)

      anime({
        targets: chars,
        opacity: show ? [0, 1] : 0,
        translateY: show ? ['40px', '0px'] : '0px',
        easing: 'easeOutQuart',
        duration: show ? 1000 : 600,
        delay: show ? anime.stagger(20) : 0,
        complete: () => {
          if (cb) cb()
        }
      })
    }
  }
}
</script>

<style lang="sass">
\:root
  --unit-l: 13.5vw
  --unit-reg: 8.02vw
  --unit-sm: 5.3125vw

  @media (max-width: 500px)
    --unit-reg: 32px

  --xs-w: 27.084vw
  --xs-h: 41.667%
  @media (max-width: 500px)
    --xs-w: 58.67vw
    --xs-h: 85.335%

  --s-w: 29.167vw
  --s-h: 41.75%
  @media (max-width: 500px)
    --s-w: 53.333vw
    --s-h: 69.35%

  --m-w: 34.0625vw
  @media (max-width: 500px)
    --m-w: 36.8vw

  --l-w: 37.5vw
  --l-h: 23%
  @media (max-width: 500px)
    --l-w: 68.26vw
    --l-h: 46.65%

  --xl-w: 57.1875vw
  --xl-h: 40%
  @media (max-width: 500px)
    --xl-w: calc(100vw - 32px)
    --xl-h: 60.8%

  --xxl-w: 57.91vw
  @media (max-width: 500px)
    --xxl-w: 57.6vw
</style>

<style lang="sass" scoped>
@import "~@/sass/utils"

$unit-l: var(--unit-l)
$unit-reg: var(--unit-reg)
$unit-sm: var(--unit-sm)

$xs-w: var(--xs-w)
$xs-h: var(--xs-h)

$s-w: var(--s-w)
$s-h: var(--s-h)

$m-w: var(--m-w)

$l-w: var(--l-w)
$l-h: var(--l-h)

$xl-w: var(--xl-w)
$xl-h: var(--xl-h)

$xxl-w: var(--xxl-w)

$mob-mb: 28%

.main
  min-height: 100vh

.page.dark
  .main-title,
  .main-title-mob
    &::before
      color: #fff

.main-title,
.main-title-mob
  &::before
    content: 'SOON'
    position: absolute
    top: 100%
    // left: 50%
    left: 0

    color: var(--color-text-lt)
    +tt(b)
    font-size: 10px
    letter-spacing: 0.24em
    text-transform: uppercase
    text-align: center
    white-space: nowrap

    transition: 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) 0s
    opacity: 0
    // transform: translate(-50%, 16px)
    transform: translate(0, 16px)

    @media (max-width: 500px)
      transition: 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)
  &.soon::before
    transition: 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) 0.2s
    opacity: 1
    // transform: translate(-50%, 0)
    transform: translate(0, 0)
    @media (max-width: 500px)
      transition: 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)

.main-soon
  pointer-events: none
  z-index: 1
  position: fixed
  top: 25vw
  left: 50vw
  margin-top: -0.5em

.main-title
  pointer-events: none
  z-index: 1
  position: fixed
  top: 25vw
  left: 50vw
  margin-top: -0.5em

  @media (max-width: 500px)
    display: none

  /deep/ span
    min-width: 0.3em
    display: inline-block
    will-change: transform, opacity

.main-title-mob
  pointer-events: none
  z-index: 1
  position: fixed
  top: 50vh
  left: 50vw

  white-space: nowrap
  text-align: center
  width: 100%
  margin-top: -0.5em
  display: none
  @media (max-width: 500px)
    max-width: 100%
    width: auto
    display: block


.img
  transition: transform .5s cubic-bezier(.455,.03,.515,.955)
  display: block
  position: relative

.img__i
  position: absolute
  top: 0
  left: 0

  width: 100%
  height: 100%
  overflow: hidden
  transform: scaleX(1)

.img img,
.img video
  width: 100%
  height: 100%
  object-fit: cover
  transition: transform .5s cubic-bezier(.455,.03,.515,.955)
  transform: scaleX(1)

.case li:first-child .img:hover
  transform: scale3d(.95,.95,1)
  img,
  video
    transform: scale3d(1.15,1.15,1)




.cases
  padding-top: 7.6%
  padding-bottom: 10%

  @media (max-width: 900px)
    padding-top: 25vh
    padding-bottom: 25vh

.case
  position: relative

.case:nth-child(1)
  margin-bottom: 11%
  padding-left: $unit-reg

  @media (max-width: 500px)
    margin-bottom: calc(#{$mob-mb} + 24px)

  li:nth-child(1)
    margin-left: $xs-w

    @media (max-width: 500px)
      margin-left: 0

  li:nth-child(1) .img
    width: 50.625vw
    padding-bottom: 59.1%

    @media (max-width: 500px)
      width: 54.67vw
      padding-bottom: 46.5%
      margin-left: auto
      margin-right: $unit-reg

  li:nth-child(2)
    position: absolute
    bottom: -7%
    left: $unit-reg

    @media (max-width: 500px)
      bottom: -24px

  li:nth-child(2) .img
    width: $m-w
    padding-bottom: 56.25%

.case:nth-child(2),
.case:nth-child(8)
  margin-bottom: 3.4%

  @media (max-width: 500px)
    margin-bottom: $mob-mb

  .img
    margin-left: $unit-reg
    width: $xs-w
    padding-bottom: $xs-h

.case:nth-child(3),
.case:nth-child(9)
  margin-bottom: 10.4%
  padding-right: $unit-sm

  @media (max-width: 500px)
    margin-bottom: $mob-mb
    padding-right: $unit-reg

  .img
    margin-left: auto
    width: $l-w
    padding-bottom: $l-h

.case:nth-child(4),
.case:nth-child(10)
  margin-bottom: 10.7%

  @media (max-width: 500px)
    margin-bottom: $mob-mb

  .img
    margin-left: auto
    margin-right: auto
    width: $s-w
    padding-bottom: $s-h

.case:nth-child(5),
.case:nth-child(13)
  margin-bottom: 10.4%

  @media (max-width: 500px)
    margin-bottom: $mob-mb

  .img
    width: $xl-w
    padding-bottom: $xl-h

.case:nth-child(6)
  margin-bottom: 10.4%

  @media (max-width: 500px)
    margin-bottom: $mob-mb

  .img
    margin-left: $xl-w
    width: calc(100vw - #{$xl-w} - #{$unit-l})
    padding-bottom: calc(100vw - #{$xl-w} - #{$unit-l})
    @media (max-width: 500px)
      margin-left: auto
      margin-right: $unit-reg
      width: 59.73vw
      padding-bottom: 59.73vw

.case:nth-child(7)
  margin-bottom: 10.4%

  @media (max-width: 500px)
    margin-bottom: $mob-mb

  .img
    margin-left: $unit-l
    margin-right: $unit-l
    width: calc(100vw - #{$unit-l} * 2)
    padding-bottom: 37.5%

    @media (max-width: 500px)
      margin-left: 64px
      margin-right: 32px
      width: calc(100vw - 96px)
      padding-bottom: 46.95%

.case:nth-child(10)
  margin-bottom: 14.2%
  @media (max-width: 500px)
    margin-bottom: $mob-mb

.case:nth-child(11)
  margin-bottom: 22%
  padding-left: $unit-reg

  @media (max-width: 500px)
    margin-bottom: calc(#{$mob-mb} + 24px)

  li:nth-child(1) .img
    width: $xxl-w
    padding-bottom: 40.77%
    // padding-bottom: 30%
    @media (max-width: 500px)
      padding-bottom: 41.983%
      // padding-bottom: 42%

  li:nth-child(2)
    position: absolute
    top: 63%
    right: $unit-reg

    @media (max-width: 500px)
      top: unset
      bottom: -24px

  li:nth-child(2) .img
    width: $m-w
    padding-bottom: 56.25%
    // padding-bottom: 64.85%

    // @media (max-width: 500px)
    //   padding-bottom: 59.4%

.case:nth-child(12)
  margin-bottom: 10.4%

  @media (max-width: 500px)
    margin-bottom: $mob-mb

  .img
    margin-left: $xl-w
    width: $xs-w
    padding-bottom: $xs-h
    @media (max-width: 500px)
      margin-left: auto
      margin-right: $unit-reg

.case:nth-child(14)
  margin-bottom: 10.4%

  @media (max-width: 500px)
    margin-bottom: $mob-mb

  .img
    margin-left: auto
    width: $m-w
    padding-bottom: 37.5%
    @media (max-width: 500px)
      width: 53.3vw
      padding-bottom: 57%


.case:nth-child(15)
  margin-bottom: 14.75%

  @media (max-width: 500px)
    margin-bottom: calc(#{$mob-mb} + 24px)

  li:nth-child(1) .img
    margin-left: $m-w
    width: $xxl-w
    padding-bottom: 37.5%

    @media (max-width: 500px)
      padding-bottom: 38.4%
      margin-left: auto
      margin-right: $unit-reg

  li:nth-child(2)
    position: absolute
    bottom: -10%
    left: $unit-reg
    @media (max-width: 500px)
      bottom: -24px

  li:nth-child(2) .img
    width: $m-w
    padding-bottom: 56.25%

.case:nth-child(16)
  margin-bottom: 10%

  @media (max-width: 500px)
    margin-bottom: 13%

  .img
    width: 39.5vw
    padding-bottom: 56.25%

    @media (max-width: 500px)
      width: 57.6vw
      padding-bottom: 74.67%
</style>
