<template>
  <div :class="['page', { dark: isDark }]">
    <Header />
    <Scroll @v-scroll="$emit('v-scroll', $event)">
      <slot></slot>
    </Scroll>
    <Toggler v-if="toggler" :dark="isDark" @click="toggle" />
  </div>
</template>

<script>
import Header from '@/Header'
import Scroll from '@/Scroll'
import Toggler from '@/Toggler'

export default {
  name: 'BaseView',
  components: {
    Header,
    Scroll,
    Toggler
  },
  props: {
    dark: { type: Boolean, default: false },
    toggler: { type: Boolean, default: false }
  },
  data: () => ({
    isDark: false
  }),
  created() {
    // Set data from props
    this.isDark = this.dark
  },
  methods: {
    toggle() {
      this.isDark = !this.isDark
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
</style>

<style lang="sass" scoped>
.page:not(.dark)
  transition: background 0.25s ease-in-out

  color: var(--color-text-lt)
  background: var(--color-bg-lt)

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text-lt)

.page.dark
  transition: background 0.25s ease-in-out

  color: var(--color-text-dk)
  background: var(--color-bg-dk)

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text-dk)
</style>
