<template>
  <main class="vision">
    <div class="vision-container u-center">
      <p
        class="t-quote-body"
        v-for="(p, i) in text"
        :key="i"
        v-html="render(p)"
      ></p>
    </div>
  </main>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
const contentful = require('contentful')

export default {
  name: 'Vision',
  data: () => ({
    text: []
  }),
  created() {
    this.fetchVision()
    this.$emit('toggle-dark', true)
  },
  destroyed() {
    this.$emit('toggle-dark', false)
  },
  methods: {
    fetchVision() {
      // Get keys
      const { space, accessToken } = this.$store.getters

      // Client instance
      const client = contentful.createClient({ accessToken, space })

      // Get 'vision'
      client
        .getEntries({
          content_type: 'vision'
        })
        .then(({ items }) => {
          const { fields } = items[0]

          // Email
          this.text.push(fields.text)

          this.$nextTick(() => {
            setTimeout(() => {
              this.$el.querySelector('.t-quote-body').classList.add('blur')
            }, 200)
          })
        })
    },
    render: item => documentToHtmlString(item)
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.vision
  color: var(--color-text-dk)
  background: var(--color-bg-dk)

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text-dk)

.vision-container
  min-height: 100vh
  width: 100vw
  overflow: hidden

.vision-container p
  line-height: 1.4444
  +yo('font-size', (375px: 24px, 1920px: 36px))
  text-align: center

  max-width: column-spans(8)

  @media (max-width: 500px)
    max-width: 100%
    padding-left: var(--unit)
    padding-right: var(--unit)

.vision-container /deep/ i
  +pf(i)

// .blur
.t-quote-body
  color: transparent
  text-shadow: 0px 0px 15px #fff
  opacity: 0
  transition: 2s

.t-quote-body.blur
  text-shadow: 0px 0px 0px #fff
  opacity: 1
</style>
