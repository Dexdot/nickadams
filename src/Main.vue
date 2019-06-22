<template>
  <div>
    <h1
      class="t-h1"
      :style="{ transform: `translate3d(-50%, ${this.translate}px, 0)` }"
      ref="title"
    ></h1>

    <ul class="cases">
      <li class="case" v-for="project in cases" :key="project.slug">
        <ul>
          <li v-for="img in project.covers" :key="img.fields.file.fileName">
            <router-link
              class="img"
              :to="`/${project.slug}`"
              @mouseover.native="mouseover(project.title)"
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
  </div>
</template>

<script>
import anime from 'animejs'
import charming from 'charming'

const contentful = require('contentful')

export default {
  name: 'Main',
  data: () => ({
    cases: [],
    chars: [],
    translate: 0
  }),
  created() {
    this.fetchCases()
  },
  methods: {
    fetchCases() {
      // Get keys
      const { space, accessToken } = this.$store.getters

      // Client instance
      const client = contentful.createClient({ accessToken, space })

      // Get cases
      client
        .getEntries({
          content_type: 'cases'
        })
        .then(({ items }) => {
          items.forEach(item => {
            item.fields.list.forEach(v => {
              this.cases.push(v.fields)
            })
          })
        })
    },
    mouseover(title) {
      this.title = title
      this.$refs.title.innerHTML = title
      charming(this.$refs.title)
      this.showTitle()
    },
    mouseout() {
      this.showTitle(false)
    },
    showTitle(show = true, cb) {
      anime({
        targets: this.$refs.title.querySelectorAll('span'),
        opacity: show ? [0, 1] : [1, 0],
        translateY: show ? ['40px', '0px'] : '0px',
        easing: 'easeOutQuart',
        duration: show ? 1000 : 600,
        delay: show ? anime.stagger(20) : 0,
        complete: () => {
          if (cb) cb()
        }
      })
    },
    onScroll(v) {
      this.translate = v
    }
  }
}
</script>

<style lang="sass" scoped>
$unit-l: 13.5vw
$unit: 8.02vw
$unit-sm: 5.3125vw

$xs-w: 25.83vw
$xs-h: 37.5%

$s-w: 32vw
$s-h: 41.75%

$m-w: 34.0625vw

$l-w: 37.5vw
$l-h: 23%

$xl-w: 57.1875vw
$xl-h: 40%

$xxl-w: 57.91vw

h1
  pointer-events: none
  z-index: 1
  position: fixed
  top: 25vw
  left: 50vw
  margin-top: -0.5em

  /deep/ span
    min-width: 0.3em
    display: inline-block
    will-change: transform, opacity


/* FIRST VARIANT WITHOUT SVG */
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

.img:hover
  transform: scale3d(.95,.95,1)
  img
    transform: scale3d(1.15,1.15,1)

/* SECOND VARIANT WITH SVG */
// .img
//   transition: transform 1s cubic-bezier(.09,.25,.38,.99)
//   display: block
//   position: relative
//   overflow: hidden

// .img:hover .decorator rect
//   stroke-width: 10%
//   transition-duration: .5s
//   transition-delay: 0s

// .img:hover .decorator image
//   transform: scale(1.1)
//   transition-duration: 0.5s
//   transition-delay: 0s

// .decorator
//   position: absolute
//   top: -5px
//   left: -5px

//   width: calc(100% + 10px)
//   height: calc(100% + 10px)

//   pointer-events: none

// .decorator image
//   transform-origin: 50% 50%
//   transition: transform 1s cubic-bezier(.09,.25,.38,.99)

// .decorator rect
//   fill: none
//   stroke: var(--color-bg-lt)
//   stroke-width: 0
//   transition: stroke-width 1s cubic-bezier(.39,.575,.565,1)

// .dark .decorator rect
//   stroke: var(--color-bg-dk)


.cases
  padding-top: 7.6%
  padding-bottom: 10%

.case
  position: relative

.case:nth-child(1)
  margin-bottom: 11%
  padding-left: $unit

  li:nth-child(1)
    margin-left: $xs-w

  li:nth-child(1) .img
    width: 50.625vw
    padding-bottom: 59.1%

  li:nth-child(2)
    position: absolute
    bottom: -7%
    left: $unit

  li:nth-child(2) .img
    width: $m-w
    padding-bottom: 56.25%

.case:nth-child(2),
.case:nth-child(8)
  margin-bottom: 3.4%

  .img
    margin-left: $unit
    width: $xs-w
    padding-bottom: $xs-h

.case:nth-child(3),
.case:nth-child(9)
  margin-bottom: 10.4%
  padding-right: $unit-sm

  .img
    margin-left: auto
    width: $l-w
    padding-bottom: $l-h

.case:nth-child(4),
.case:nth-child(10)
  margin-bottom: 10.7%

  .img
    margin-left: auto
    margin-right: auto
    width: $s-w
    padding-bottom: $s-h

.case:nth-child(5),
.case:nth-child(13)
  margin-bottom: 10.4%

  .img
    width: $xl-w
    padding-bottom: $xl-h

.case:nth-child(6)
  margin-bottom: 10.4%

  .img
    margin-left: $xl-w
    width: calc(100vw - #{$xl-w} - #{$unit-l})
    padding-bottom: calc(100vw - #{$xl-w} - #{$unit-l})

.case:nth-child(7)
  margin-bottom: 10.4%

  .img
    margin-left: $unit-l
    margin-right: $unit-l
    width: calc(100vw - #{$unit-l} * 2)
    padding-bottom: 37.5%
.case:nth-child(10)
  margin-bottom: 14.2%
.case:nth-child(11)
  margin-bottom: 22%
  padding-left: $unit

  li:nth-child(1) .img
    width: $xxl-w
    padding-bottom: 30%

  li:nth-child(2)
    position: absolute
    top: 63%
    right: $unit

  li:nth-child(2) .img
    width: $m-w
    padding-bottom: 64.85%

.case:nth-child(12)
  margin-bottom: 10.4%

  .img
    margin-left: $xl-w
    width: $xs-w
    padding-bottom: $xs-h
.case:nth-child(14)
  margin-bottom: 10.4%

  .img
    margin-left: auto
    width: $m-w
    padding-bottom: 37.5%
.case:nth-child(15)
  margin-bottom: 14.75%

  li:nth-child(1) .img
    margin-left: $m-w
    width: $xxl-w
    padding-bottom: 37.5%

  li:nth-child(2)
    position: absolute
    bottom: -10%
    left: $unit

  li:nth-child(2) .img
    width: $m-w
    padding-bottom: 56.25%

.case:nth-child(16)
  margin-bottom: 10%

  .img
    width: 39.5vw
    padding-bottom: 56.25%
</style>
