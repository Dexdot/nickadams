<template>
  <ul
    ref="list"
    :class="['dropdown__list', { 'dropdown__list--expanded': expanded }]"
    :style="{
      transform: `translateY(-${expanded ? 0 : index * height}px)`,
      maxHeight: expanded ? `${height * list.length}px` : `${height}px`
    }"
    @mouseleave="onMouseout"
  >
    <li
      :class="['dropdown__li', { active: i === index }]"
      v-for="(item, i) in list"
      :key="item.sys.id"
      @click="onClick(i)"
      @mouseover="onMouseover(i)"
    >
      <span>{{ item.fields.text }}</span>
    </li>
  </ul>
</template>

<script>
import { isTouchDevice } from '@/scripts/detect'

export default {
  name: 'Dropdown',
  props: {
    list: Array
  },
  data: () => ({
    expanded: false,
    index: 0,
    height: 24,
    isTouch: false
  }),
  mounted() {
    this.isTouch = isTouchDevice()
    this.$nextTick(this.setup)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calcHeight.bind(this))
  },
  methods: {
    setup() {
      this.calcHeight()
      window.addEventListener('resize', this.calcHeight.bind(this))
    },
    calcHeight() {
      this.height = this.$refs.list.children[0].offsetHeight
    },
    onClick(i) {
      if (this.isTouch && !this.expanded) {
        if (i === this.index) this.expanded = true
      } else {
        this.index = i
        this.expanded = false
        this.$emit('click', this.list[i])
      }
    },
    onMouseover(i) {
      if (this.isTouch) return false

      if (i === this.index) this.expanded = true
    },
    onMouseout() {
      this.expanded = false
    }
  }
}
</script>

<style lang="sass" scoped>
.dropdown__li
  cursor: pointer
  transition: .5s cubic-bezier(.645,.045,.355,1)
  opacity: 0
  pointer-events: none
  &.active
    opacity: 1
    pointer-events: auto

.dropdown__li span
  position: relative
  padding-bottom: 2px

.dropdown__li span::before
  content: ''
  position: absolute
  bottom: 0
  left: 0

  display: block
  width: 100%
  height: 1px

  background: rgba(0,0,0, 0.2)
  transition: transform .3s cubic-bezier(.645,.045,.355,1)
  transform-origin: 0% 50%
  transform: scaleX(0)

.dropdown__li:hover span::before,
.dropdown__li.active span::before
  transform: scaleX(1)

.dropdown__list
  transition: transform .5s cubic-bezier(.645,.045,.355,1), max-height .5s cubic-bezier(.645,.045,.355,1)

.dropdown__list--expanded .dropdown__li
  opacity: 1
  pointer-events: auto
</style>
