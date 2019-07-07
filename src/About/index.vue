<template>
  <main class="about container">
    <section class="about__info u-flex">
      <article class="about__text">
        <p v-for="(p, i) in content.text" :key="i" v-html="render(p)"></p>
        <img src="./sign.svg" alt="Подпись" class="sign" />
      </article>
      <div class="about__contact">
        <p>Contact</p>

        <ul>
          <li>
            <a :href="`mailto:${this.content.email}`">{{
              this.content.email
            }}</a>
          </li>
          <li>
            PO Box 106-377
          </li>
          <li>
            Saint Petersburg
          </li>
          <li>
            Russia
          </li>
        </ul>

        <ul>
          <li>
            <a href="https://behance.net/stereocage" target="_blank">Behance</a>
          </li>
          <li>
            <a href="https://dribbble.com/stereocage" target="_blank"
              >Dribbble</a
            >
          </li>
          <li>
            <a href="https://instagram.com/stereocage" target="_blank"
              >Instagram</a
            >
          </li>
          <li>
            <a href="https://facebook.com/stereocage" target="_blank"
              >Facebook</a
            >
          </li>
          <li>
            <a href="https://github.com/Dexdot" target="_blank">Github</a>
          </li>
        </ul>
      </div>
    </section>

    <ul class="about__list u-flex">
      <li v-for="file in content.mediaList" :key="file.url">
        <figure class="about__img">
          <video v-if="file.type === 'video'" autoplay playsinline loop>
            <source :src="file.url" :type="file.contentType" />
          </video>

          <img
            v-if="file.type === 'image'"
            :src="file.url"
            :alt="file.fileName"
          />
        </figure>
      </li>
    </ul>

    <figure class="about__big">
      <video v-if="content.mediaBig.type === 'video'" autoplay playsinline loop>
        <source
          :src="content.mediaBig.url"
          :type="content.mediaBig.contentType"
        />
      </video>

      <img
        v-if="content.mediaBig.type === 'image'"
        :src="content.mediaBig.url"
        :alt="content.mediaBig.fileName"
      />

      <h1 class="about__title">
        <span>No one there</span><span>get back</span>
      </h1>
    </figure>
  </main>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
const contentful = require('contentful')

export default {
  name: 'About',
  data: () => ({
    content: {
      email: 'stereocage@gmail.com',
      mediaList: [],
      mediaBig: {},
      text: []
    }
  }),
  created() {
    this.$emit('toggle-dark', true)
    this.fetchAbout()
  },
  methods: {
    fetchAbout() {
      // Get keys
      const { space, accessToken } = this.$store.getters

      // Client instance
      const client = contentful.createClient({ accessToken, space })

      // Get 'about'
      client
        .getEntries({
          content_type: 'about'
        })
        .then(({ items }) => {
          const { fields } = items[0]

          // Email
          this.content.email = fields.email

          // Rich text
          this.content.text = fields.text.content

          // Images
          fields.mediaList.forEach(item => {
            this.content.mediaList.push({
              ...item.fields.file,
              type: item.fields.file.contentType.split('/')[0]
            })
          })

          // Big image
          this.content.mediaBig = {
            ...fields.mediaBig.fields.file,
            type: fields.mediaBig.fields.file.contentType.split('/')[0]
          }
        })
    },
    render: item => documentToHtmlString(item)
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.about
  min-height: 100vh
  padding-top: 5.6vh
  padding-bottom: 10.5%

  color: var(--color-text-dk)
  background: var(--color-bg-dk)

  @media (max-width: 800px) and (min-height: 801px)
    padding-top: 240px
    padding-bottom: 320px

  @media (max-width: 800px) and (max-height: 800px)
    padding-top: 36vh
    padding-bottom: 48vh

  /deep/ a
    &,
    &:visited,
    &:active,
    &:focus
      color: var(--color-text-dk)

.about__info
  padding-left: mix(3)
  margin-bottom: 16%

  @media (max-width: 800px)
    padding-left: 0
    flex-direction: column
    margin-bottom: 80px

.about__text
  width: column-spans(3)
  line-height: 1.625

  @media (max-width: 800px)
    width: 100%
    margin-bottom: 96px

.about__text p
  margin-bottom: 24px

.about__contact
  margin-left: gutters(1)

  @media (max-width: 800px)
    margin: 0

.about__contact ul
  padding-top: 24px

.about__contact ul li
  margin-bottom: 8px

.about__list
  padding-left: mix(3)
  margin-left: calc(#{gutters(1)} * -1)
  margin-bottom: 11.4%

  @media (max-width: 800px)
    padding: 0
    margin: 0
    flex-direction: column

.about__list > li
  margin-left: gutters(1)

  @media (max-width: 800px)
    margin-left: 0
    margin-bottom: 104px
    width: 100%

.about__list > li:nth-child(even) .about__img
  @media (max-width: 800px)
    margin-left: auto

.about__img
  position: relative
  width: column-spans(3)
  padding-bottom: 146.37%

  @media (max-width: 800px)
    width: 58.6vw
    padding-bottom: 103%

.about__img video,
.about__img img
  position: absolute
  top: 0
  left: 0

  width: 100%
  height: 100%
  object-fit: cover

.about__big
  position: relative
  width: calc(#{var(--unit)} + #{column-spans(7)})
  padding-bottom: 40.917%
  margin-left: calc(-1 * var(--unit))

  @media (max-width: 800px)
    margin-left: calc(-1 * var(--unit))
    width: 91.5vw
    padding-bottom: 72%

.about__big img
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  object-fit: cover

.about__title
  position: absolute
  top: 0
  left: 100%
  writing-mode: vertical-lr
  transform: rotate(-180deg) translateX(calc(#{gutters(1)} * -1))

  display: flex
  flex-direction: column-reverse
  align-items: flex-end

  text-align: right
  text-transform: uppercase
  font-weight: 400
  +yo('font-size', (375px: 18px, 1920px: 48px, 2550px: 64px))

  @media (max-width: 800px)
    left: unset
    right: 0
    top: calc(100% + var(--unit))
    transform: rotate(-180deg)

    white-space: nowrap


.sign
  margin-top: 24px
  width: 182px
  height: auto
</style>
