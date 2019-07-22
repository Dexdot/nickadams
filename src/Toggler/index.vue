<template>
  <div :class="['toggler u-center', { visible }]">
    <svg
      v-if="isDark"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0)">
        <path
          d="M8 0.666504V1.99984"
          stroke="white"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 14V15.3333"
          stroke="white"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2.81323 2.81348L3.7599 3.76014"
          stroke="white"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.24 12.2402L13.1867 13.1869"
          stroke="white"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M0.666748 8H2.00008"
          stroke="white"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14 8H15.3333"
          stroke="white"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2.81323 13.1869L3.7599 12.2402"
          stroke="white"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.24 3.76014L13.1867 2.81348"
          stroke="white"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="8" cy="8" r="3" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>

    <svg
      v-else
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      :style="{ opacity: 0.2 }"
    >
      <path
        d="M13.9999 8.52667C13.8951 9.66147 13.4692 10.7429 12.7721 11.6445C12.075 12.5461 11.1356 13.2305 10.0637 13.6177C8.99188 14.0049 7.83192 14.0787 6.7196 13.8307C5.60728 13.5827 4.5886 13.023 3.78275 12.2172C2.97691 11.4113 2.41723 10.3927 2.16921 9.28033C1.92118 8.16801 1.99508 7.00806 2.38224 5.9362C2.7694 4.86434 3.45382 3.92491 4.35541 3.22784C5.257 2.53076 6.33847 2.10487 7.47327 2C6.80888 2.89884 6.48917 4.0063 6.57229 5.12094C6.65541 6.23559 7.13584 7.28337 7.9262 8.07373C8.71656 8.86409 9.76435 9.34452 10.879 9.42765C11.9936 9.51077 13.1011 9.19106 13.9999 8.52667V8.52667Z"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script>
import { isTouchDevice } from '@/scripts/detect'

export default {
  name: 'Toggler',
  props: {
    isDark: { type: Boolean, default: false }
  },
  data: () => ({
    visible: false,
    timeout: null
  }),
  mounted() {
    if (isTouchDevice()) this.visible = true
    window.addEventListener('mousemove', this.mousemove.bind(this))
  },
  destroyed() {
    window.removeEventListener('mousemove', this.mousemove.bind(this))
  },
  methods: {
    mousemove() {
      this.visible = true

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.visible = false
      }, 500)
    }
  }
}
</script>

<style lang="sass" scoped>
.toggler
  transition: opacity 0.25s ease
  opacity: 0
  pointer-events: none

  @media (max-width: 500px)
    opacity: 1
    pointer-events: none

.toggler.visible
  opacity: 1
  pointer-events: auto

.toggler svg
  stroke: var(--color-text-lt)

.dark .toggler svg
  stroke: var(--color-text-dk)

.toggler
  position: fixed
  top: calc(var(--vh, 1vh) * 92)
  right: var(--unit)

  width: 16px
  height: 16px
</style>
