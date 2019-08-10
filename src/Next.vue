<template>
  <section :class="['next']">
    <div class="next-container">
      <router-link :to="to">
        <h2 class="t-h2">
          <slot name="title"></slot>
        </h2>
      </router-link>
      <p><slot name="text"></slot></p>
      <span class="next-counter" ref="counter">{{ counter }}</span>
    </div>
  </section>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'Next',
  props: {
    to: { type: [String, Object], default: '/' },
    pageDark: { type: Boolean, default: true },
    isDark: { type: Boolean, default: true }
  },
  data: () => ({
    easing: 'cubicBezier(0.25, 0.1, 0.25, 1)',
    isAnimating: false,
    counter: 3,
    counterEl: null
  }),
  mounted() {
    this.counterEl = this.$refs.counter
    this.observe()
  },
  methods: {
    startCount() {
      const tl = anime.timeline({
        delay: this.counter === 5 ? 300 : 0,
        easing: this.easing,
        complete: () => {
          if (this.counter <= 1) {
            this.isAnimating = false
            this.$router.push(this.to)
          } else {
            this.counter--
            this.startCount()
          }
        }
      })

      const duration = 200
      const show = targets => ({
        // opacity: [0, 1],
        translateY: ['-15%', '0%'],
        targets,
        duration
      })
      const hide = targets => ({
        // opacity: [1, 0],
        translateY: ['0%', '15%'],
        targets,
        duration,
        delay: duration * 1.5
      })

      tl.add(show(this.counterEl)).add(hide(this.counterEl))
    },
    stopCount() {
      this.isAnimating = false
      anime.remove(this.counterEl)
      anime({
        targets: this.counterEl,
        opacity: 0,
        duration: 200,
        easing: this.easing,
        complete: () => {
          this.counter = 3
        }
      })
    },
    observe() {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.$emit('intersect', entry)
            } else {
              this.$emit('notintersect', entry)
            }

            if (entry.intersectionRatio >= 0.4) {
              this.$emit('toggle-dark', this.isDark)

              if (!this.isAnimating) {
                this.isAnimating = true
                this.startCount()
              }
            } else {
              this.$emit('toggle-dark', this.pageDark)
              this.stopCount()
            }
          })
        },
        { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
      )
      observer.observe(this.$el)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.next
  position: relative

  width: 100vw
  height: 100vh
  padding-right: mix(1, 1)

  display: flex
  flex-direction: column
  justify-content: center
  align-items: flex-end

  text-align: right

  @media (max-width: 500px)
    padding-right: var(--unit)

.next-container h2
  display: block
  margin-bottom: 8px

  @media (max-width: 500px)
    font-size: 36px

  @media (max-width: 360px)
    font-size: 30px

.next-container p
  margin-left: auto
  max-width: 29em
  opacity: 0.4

  @media (max-width: 500px)
    max-width: 70%

.next-counter
  // position: absolute
  // top: 50%
  // left: 50%

  // transform: translateX(-50%)
  opacity: 0
  display: block
  margin-top: 16px
  // margin-top: -0.565em

  // +yo('font-size', (1440px: 120px, 2550px: 180px))
  font-size: 20px

  @media (max-width: 1200px)
    left: var(--unit)
    transform: translateX(0)

  // @media (max-width: 700px)
  //   font-size: 80px
</style>
