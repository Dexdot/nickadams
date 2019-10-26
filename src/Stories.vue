<template>
  <transition name="stories">
    <section
      :class="['stories-section', { 'is-touch': isTouch }]"
      v-show="active"
      @click="onClick"
    >
      <div class="stories-head" v-if="$refs.swiper">
        <img
          :src="previewImage.src"
          :alt="previewImage.alt"
          class="stories-circle"
        />

        <div class="stories-caption">
          <p>{{ project.title }}</p>
          <p>{{ project.subtitle }}</p>
        </div>

        <button class="stories-close" @click="$emit('click')">
          <img :src="require('./assets/close.svg')" alt="Close" />
        </button>
      </div>

      <swiper v-if="project" :options="swiperOptions" ref="swiper">
        <swiper-slide v-for="story in project.list" :key="story.sys.id">
          <div class="story-img">
            <img
              :src="story.fields.file.url"
              :alt="story.fields.title"
              class="story-img__i"
            />
          </div>
        </swiper-slide>
      </swiper>
    </section>
  </transition>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import { isTouchDevice } from '@/scripts/detect'

export default {
  name: 'Stories',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    project: { type: Object, default: () => {} }
  },
  data: () => ({
    swiperOptions: {
      initialSlide: 0,
      speed: 400,
      slidesPerView: 'auto',
      autoHeight: true,
      centeredSlides: true,
      slideToClickedSlide: true,
      grabCursor: true
    },
    isTouch: false
  }),
  computed: {
    previewImage() {
      return this.project.list
        ? {
            src: this.project.list[this.$refs.swiper.swiper.activeIndex].fields
              .file.url,
            alt: this.project.list[this.$refs.swiper.swiper.activeIndex].fields
              .title
          }
        : { src: '', alt: '' }
    }
  },
  watch: {
    active(opening) {
      opening && this.$refs.swiper && this.$refs.swiper.swiper.slideTo(0)
    }
  },
  mounted() {
    this.isTouch = isTouchDevice()
  },
  beforeDestroy() {
    this.$refs.swiper.swiper.destroy(true, false)
  },
  methods: {
    onClick({ target }) {
      const classes = ['stories-link', 'swiper']

      if (
        !classes.some(cls => target.className.indexOf(cls) !== -1) &&
        !this.isTouch
      ) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

// Animation
.stories-enter,
.stories-leave-to
  opacity: 0
  pointer-events: none


.stories-enter-to,
.stories-leave
  opacity: 1
  pointer-events: auto

.stories-enter-active,
.stories-leave-active
  transition: 0.25s $ease-out


// Styles
.stories-circle
  width: 48px
  height: 48px
  margin-right: 24px

  border-radius: 50%
  object-fit: cover

  @media (max-width: 500px)
    display: none

.stories-head
  width: 100%
  display: flex
  align-items: center

  position: absolute
  top: 3.7%
  padding: 0 var(--unit)

  @media (max-width: 900px)
    top: 32px

.stories-caption
  display: flex
  align-items: center

  p:nth-child(2)
    margin-left: 8px
    padding-left: 12px

    color: rgba(var(--color-text-lt), 0.3)

    position: relative

    &::before
      content: ''
      position: absolute
      top: 50%
      left: 0
      transform: translate(0, -50%)

      width: 4px
      height: 4px

      background: rgba(var(--color-text-lt), 0.2)
      border-radius: 50%

  @media (max-width: 500px)
    font-size: 14px

.stories-section
  z-index: 3
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0

  padding-top: 13.4vh
  width: 100vw
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)
  overflow: hidden

  background: #fff
  &:not(.is-touch)
    cursor: url('~@/assets/close.svg') 24 24, pointer


  @media (min-width: 1001px) and (max-width: 1440px) and (max-height: 700px)
    display: flex
    align-items: flex-end
    padding-bottom: 24px

  @media (max-width: 1000px)
    display: flex
    align-items: center
    justify-content: center
    padding-top: 0

  @media (max-width: 500px)
    align-items: flex-start
    padding-bottom: 24px
    padding-top: 96px



.stories-close
  margin-left: auto
  display: none
  @media (max-width: 500px)
    display: block

  &,
  img
    width: 40px
    height: 40px

.story-img
  position: relative
  width: mix(3)

  @media (max-width: 500px)
    width: calc(100vw - (4 * var(--unit)))

  &::before
    content: ''
    display: block
    width: 100%
    padding-bottom: 177%
    @media (max-width: 500px)
      padding-bottom: 160%

.story-img__i
  position: absolute
  top: 0
  left: 0

  width: 100%
  height: 100%
  object-fit: cover

.swiper-slide
  width: auto
  &:not(:last-child) .story-img
    margin-right: gutters(1)
    @media (max-width: 500px)
      margin-left: calc(var(--unit) / 2)
      margin-right: calc(var(--unit) / 2)

  &::before
    content: ''
    z-index: 1
    position: absolute
    top: 0
    left: 0

    width: 100%
    height: 100%

    background: rgba(#fff, 0.9)
    transition: 0.4s ease

.swiper-slide-active::before
  opacity: 0
</style>
