<template>
  <div>
    <div class="case-box" :style="{ backgroundColor: color }">
      <template v-if="content.images.length > 1">
        <lory
          ref="slider"
          class="lory-images case-box-shadow"
          :options="loryOptions"
          @lory-init="onLoryInit"
        >
          <item v-for="img in content.images" :key="img.fields.file.url">
            <img
              draggable="false"
              class="lory-image"
              :src="img.fields.file.url"
              :alt="img.fields.title"
            />
          </item>
        </lory>
        <ul class="case-box-dots u-center u-mla u-mra">
          <li
            class="u-center"
            v-for="(img, i) in content.images"
            :key="img.fields.file.url"
          >
            <button
              :class="['case-box-dot', { active: index === i }]"
              @click="slideTo(i)"
            ></button>
          </li>
        </ul>
      </template>

      <img
        v-else
        class="case-box-shadow"
        :src="content.images[0].fields.file.url"
        :alt="content.images[0].fields.title"
      />
    </div>
  </div>
</template>

<script>
// import { Lory, Item } from 'vue-lory'
import { Lory, Item } from '@/Lory'

export default {
  name: 'CaseBox',
  components: {
    Lory,
    Item
  },
  props: {
    content: Object,
    color: String
  },
  data: () => ({
    index: 0,
    lory: null,
    loryOptions: {
      slideSpeed: 800,
      enableMouseEvents: true,
      infinite: 1,
      ease: 'easeOutQuad'
    }
  }),
  methods: {
    onLoryInit(lory) {
      this.lory = lory
      this.$refs.slider.$el.addEventListener(
        'after.lory.slide',
        this.onSlide.bind(this)
      )
    },
    onSlide({ detail }) {
      this.index = detail.currentSlide - 1
    },
    slideTo(i) {
      if (this.lory) {
        this.lory.slideTo(i)
        this.index = i
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.lory-images li
  padding-bottom: 56.25%
  position: relative

.lory-images li img
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  object-fit: cover

.case-box
  margin-bottom: gutters(1)
  padding: 10.4% 12.7%

  @media (max-width: 900px)
    margin-bottom: 16px

  @media (max-width: 700px)
    width: 100vw
    margin-left: calc(-1 * var(--unit))
    padding: 12.9% var(--unit)

.case-box-shadow
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.15)

.case-box-dots
  margin-left: -16px
  transform: translateY(3vw)

  @media (max-width: 700px)
    transform: translateY(5vw)

.case-box-dots li
  margin-left: 16px
  width: 6px
  height: 6px

.case-box-dot
  border-radius: 50%
  background: var(--color-text-lt)
  opacity: 0.6
  transition: $trs

  width: 6px
  height: 6px

.case-box-dot.active
  opacity: 1

img
  display: block
  max-width: 100%
  width: 100%
  height: auto
</style>
