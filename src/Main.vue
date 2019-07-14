<template>
  <main :class="['main', { dark: isDark }]">
    <h1
      class="t-h1"
      :style="{ transform: `translate3d(-50%, ${this.scroll}px, 0)` }"
      ref="title"
    ></h1>

    <ul class="cases">
      <li class="case" v-for="project in cases" :key="project.slug">
        <ul>
          <li
            v-for="(img, i) in project.covers"
            :key="img.fields.file.fileName"
          >
            <router-link
              class="img"
              :to="`/case/${project.slug}`"
              @mouseover.native="mouseover(project.title, i)"
              @mouseout.native="mouseout"
            >
              <div class="img__i">
                <img :src="img.fields.file.url" :alt="project.title" />
              </div>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>

    <router-link :to="isDark ? '/' : '/black'">
      <Toggler
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
    isDark: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    chars: []
  }),
  computed: {
    ...mapGetters(['blackCases', 'mainCases']),
    cases() {
      return this.isDark ? this.blackCases : this.mainCases
    }
  },
  methods: {
    mouseover(title) {
      if (!this.$refs.title) return false

      this.title = title
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

      anime.remove(chars)

      anime({
        targets: chars,
        opacity: show ? [0, 1] : [1, 0],
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

  --xs-w: 25.83vw
  --xs-h: 37.5%
  @media (max-width: 500px)
    --xs-w: 58.67vw
    --xs-h: 85.335%

  --s-w: 32vw
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

.main:not(.dark)
  transition: background 0.25s ease-in-out

  color: var(--color-text-lt)
  background: var(--color-bg-lt)

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text-lt)

.main.dark
  transition: background 0.25s ease-in-out

  color: var(--color-text-dk)
  background: var(--color-bg-dk)

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text-dk)

  .cover__inner
    background: var(--color-bg-lt)

h1
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

.img img
  width: 100%
  height: 100%
  object-fit: cover
  transition: transform .5s cubic-bezier(.455,.03,.515,.955)
  transform: scaleX(1)

.case li:first-child .img:hover
  transform: scale3d(.95,.95,1)
  img
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
    padding-bottom: 30%
    @media (max-width: 500px)
      padding-bottom: 42%

  li:nth-child(2)
    position: absolute
    top: 63%
    right: $unit-reg

    @media (max-width: 500px)
      top: unset
      bottom: -24px

  li:nth-child(2) .img
    width: $m-w
    padding-bottom: 64.85%

    @media (max-width: 500px)
      padding-bottom: 59.4%

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
