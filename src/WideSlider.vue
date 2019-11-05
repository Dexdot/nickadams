<template>
  <section
    class="wideslider"
    :style="{ backgroundColor: content.color || '#1F2020' }"
  >
    <swiper class="wideslider__list" :options="swiperOptions" ref="swiper">
      <swiper-slide
        class="wideslider__li"
        v-for="(img, i) in content.images"
        :key="i + img.fields.file.url"
      >
        <ImageDecode
          v-if="isImage(img)"
          :src="img.fields.file.url"
          :alt="img.fields.title"
          draggable="false"
        />
        <video
          v-if="isVideo(img)"
          :src="img.fields.file.url"
          playsinline
          loop
          autoplay
          muted
          draggable="false"
        />
      </swiper-slide>
    </swiper>
  </section>
</template>

<script>
import ImageDecode from '@/ImageDecode'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { isImage, isVideo } from '@/scripts/helpers'

export default {
  name: 'WideSlider',
  components: {
    ImageDecode,
    swiper,
    swiperSlide
  },
  props: {
    content: Object
  },
  data: () => ({
    swiperOptions: {
      speed: 400,
      slidesPerView: 'auto',
      centeredSlides: true,
      slideToClickedSlide: true,
      grabCursor: true
    }
  }),
  beforeDestroy() {
    this.$refs.swiper.swiper.destroy(true, false)
  },
  methods: {
    isImage,
    isVideo
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.wideslider
  padding: 15% 0
  width: 100vw
  margin-bottom: 9%
  margin-left: calc(-1 * #{mix(2)} - #{var(--unit)})
  @media (max-width: 900px)
    margin-bottom: 48px
    margin-left: calc(-1 * var(--unit))


.wideslider__li
  display: flex
  align-items: center
  justify-content: center
  width: calc(#{mix(11)} + #{gutters(1)} / 2)

  margin-left: 2.135vw
  margin-right: 2.135vw

  @media (max-width: 900px)
    width: column-spans(10)

  @media (max-width: 500px)
    width: calc(100vw - var(--unit) * 2)

  margin-left: var(--unit)
  margin-right: var(--unit)

  img, video
    display: block
    height: auto
    width: 100%
</style>
