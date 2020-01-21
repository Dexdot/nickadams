<template>
  <transition name="stories">
    <section
      :class="['stories-section', { 'is-touch': isTouch }]"
      v-show="active"
    >
      <div class="stories-head" v-if="$refs.swiper">
        <p class="t-ttu">{{ project.title }}</p>

        <button class="stories-close" @click="$emit('click')">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 8L8 24" />
            <path d="M8 8L24 24" />
          </svg>
        </button>
      </div>

      <swiper v-if="project" :options="swiperOptions" ref="swiper">
        <swiper-slide v-for="(story, i) in project.list" :key="story.sys.id">
          <div class="story-img" @click="onSlideClick($event, i)">
            <BaseImage
              class="story-img__i"
              v-if="isImage(story)"
              :img="story"
              :alt="story.fields.title"
            />
            <video
              v-if="isVideo(story)"
              class="story-img__i"
              :src="story.fields.file.url"
              playsinline
              autoplay
              muted
              loop
            />
          </div>
        </swiper-slide>

        <swiper-slide class="swiper-slide--last" v-if="project.url">
          <div
            class="story-img"
            @click="onSlideClick($event, project.list.length)"
          >
            <a
              ref="link"
              :class="{
                'long-text':
                  project.url.replace(/(^\w+:|^)\/\//, '').length > 35
              }"
              :href="project.url"
              target="_blank"
              @click.prevent
            >
              <span class="t-ttu">{{
                project.url.replace(/(^\w+:|^)\/\//, '')
              }}</span>
            </a>
          </div>
        </swiper-slide>
      </swiper>
    </section>
  </transition>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import BaseImage from '@/BaseImage'

import { isTouchDevice } from '@/scripts/detect'
import { isImage, isVideo } from '@/scripts/helpers'

export default {
  name: 'Stories',
  components: {
    swiper,
    swiperSlide,
    BaseImage
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
      // slideToClickedSlide: true,
      grabCursor: true
    },
    isTouch: false
  }),
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
    isImage,
    isVideo,
    onSlideClick(e, i) {
      const { swiper } = this.$refs.swiper
      const isLast = i === this.project.list.length && i === swiper.activeIndex

      if (!this.project.url || !isLast) {
        swiper.slideTo(i)
      } else if (isLast) {
        window.open(this.$refs.link.href)
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
.stories-head
  width: 100%
  display: flex
  align-items: center
  justify-content: space-between

  position: absolute
  top: 3.7%
  padding: 0 var(--unit)

  @media (max-width: 900px)
    top: 32px

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
  display: flex
  align-items: center
  justify-content: center

  background: #fff

  @media (min-width: 1001px) and (max-width: 1440px) and (max-height: 700px)
    align-items: flex-end
    padding-bottom: 24px

  @media (max-width: 1000px)
    padding-top: 0

  @media (max-width: 500px)
    padding-top: 40px

.stories-close
  cursor: pointer

  display: block
  width: 32px
  height: 32px

  @media (max-width: 500px)
    width: 24px
    height: 24px

.stories-close svg
  stroke: var(--color-text-lt)
  @media (max-width: 500px)
    width: 24px
    height: 24px

.story-img
  will-change: transform
  position: relative
  width: mix(3)
  &::before
    content: ''
    display: block
    width: 100%
    padding-bottom: 175.65%
    @media (max-width: 500px)
      padding-bottom: 160%

  @media (max-width: 500px)
    width: calc(100vw - (4 * var(--unit)))

.story-img__i
  position: absolute
  top: 0
  left: 0

  width: 100%
  height: 100%
  object-fit: cover

.swiper-slide
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)
  width: auto

  @media (max-width: 500px)
    transition: transform 0.2s ease

  .story-img
    margin-left: 1vw
    margin-right: 1vw
    @media (max-width: 500px)
      margin-left: 0.27vw
      margin-right: 0.27vw

.swiper-slide:not(.swiper-slide-active)
  transform: scale(0.89)
  @media (max-width: 500px)
    transform: scale(0.855)

.swiper-slide-active
  transform: scale(1)

// Last slide url
.swiper-slide--last
  .story-img::before
    background: #fff

  a
    border: 1px solid var(--color-text-lt)

    z-index: 1
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)

    width: 99%
    height: 99%
    display: flex
    align-items: center
    justify-content: center

    span
      transform: rotate(-180deg)
      writing-mode: vertical-lr
      @media (max-width: 1440px)
        font-size: 12px

    &.long-text span
      font-size: 12px
      @media (max-width: 1440px)
        font-size: 11px
</style>
