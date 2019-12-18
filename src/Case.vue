<template>
  <main class="u-ovxh">
    <article class="case" v-if="project">
      <h1 class="case__title t-h3">{{ project.title }}</h1>
      <p>{{ project.subtitle }}</p>

      <div class="case__cover">
        <BaseImage
          class="case__img"
          draggable="false"
          :img="project.cover"
          :alt="project.cover.fields.title"
          @complete="onBaseImageComplete"
        />
        <div
          class="case__preview"
          v-if="project.stories && project.stories.length > 1"
        >
          <ButtonPreview
            ref="preview"
            :list="project.stories"
            @click="
              $emit('show-stories', {
                list: project.stories,
                title: project.title,
                subtitle: project.date,
                url: project.etalon
              })
            "
          />
        </div>
      </div>

      <section :style="[{ 'min-height': `${asideHeight}px` }]">
        <aside ref="aside">
          <ul>
            <li>
              <!-- <b>Client</b> -->
              <b>{{ project.clientLabel || 'Client' }}</b>
              <p>{{ project.client }}</p>
            </li>
            <li>
              <b>Role</b>
              <p>{{ project.role }}</p>
            </li>
            <li>
              <b>Date</b>
              <p>{{ project.date }}</p>
            </li>
            <template v-if="project.awards">
              <li>
                <b>Awards</b>
                <p>{{ project.awards }}</p>
              </li>
            </template>
          </ul>
        </aside>

        <ul class="case__content">
          <li
            v-for="(item, i) in content"
            :key="i + item.nodeType"
            :class="{
              case__text: isText(item),
              case__block: isBlock(item),
              'case__box--no-mb':
                isBox(item) && item.data.target.fields.resetBottom
            }"
          >
            <p v-if="isText(item)" v-html="render(item)"></p>

            <BaseImage
              class="case__img"
              draggable="false"
              :img="item.data.target"
              :alt="item.data.target.fields.title"
              @complete="onBaseImageComplete"
              v-if="isImage(item)"
            />

            <video
              class="case__img"
              v-if="isVideo(item)"
              :src="item.data.target.fields.file.url"
              draggable="false"
              autoplay
              playsinline
              loop
              muted
            />

            <CaseBox v-if="isBox(item)" :content="item.data.target.fields" />

            <CaseRow v-if="isRow(item)" :content="item.data.target.fields" />

            <MobileBox
              v-if="isMobileBox(item)"
              :content="item.data.target.fields"
            />

            <WideSlider
              v-if="isWideslider(item)"
              :content="item.data.target.fields"
            />
          </li>
        </ul>
      </section>

      <ul class="case__footer">
        <li
          class="u-flex"
          v-if="project.team && project.team.content.length > 0"
        >
          <div class="case__footer-col">
            <b>Team</b>
          </div>
          <div class="case__footer-col">
            <ul class="case__team">
              <li
                v-for="(item, i) in project.team.content"
                :key="i + item.nodeType"
              >
                <p v-if="isText(item)" v-html="render(item)"></p>
              </li>
            </ul>
          </div>
        </li>
        <li class="u-flex" v-if="project.contentAuthors">
          <div class="case__footer-col">
            <b>Content</b>
          </div>
          <div class="case__footer-col">
            <ul>
              <li
                v-for="(item, i) in project.contentAuthors"
                :key="i + project.slug"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </li>
        <li class="u-flex" v-if="project.etalon">
          <div class="case__footer-col">
            <b>Etalon</b>
          </div>

          <div class="case__footer-col">
            <a :href="project.etalon" target="_blank">
              {{ project.etalon.replace(/(^\w+:|^)\/\//, '') }}
            </a>
          </div>
        </li>
      </ul>
    </article>

    <Next
      v-if="project && nextCase"
      :to="nextCase.to"
      @toggle-dark="$emit('toggle-dark', $event)"
      :pageDark="false"
    >
      <span slot="title">{{ nextCase.title }}</span>
      <span slot="text">
        {{ nextCase.subtitle }}
      </span>
    </Next>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

import ButtonPreview from '@/ButtonPreview'
import Next from '@/Next'
import CaseRow from '@/CaseRow'
import CaseBox from '@/CaseBox'
import MobileBox from '@/MobileBox'
import WideSlider from '@/WideSlider'
import BaseImage from '@/BaseImage'

import loop from '@/scripts/loop'
import { fetchCase } from '@/scripts/api'
import { isImage, isVideo } from '@/scripts/helpers'

import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

export default {
  name: 'Case',
  components: {
    ButtonPreview,
    Next,
    CaseRow,
    CaseBox,
    MobileBox,
    WideSlider,
    BaseImage
  },
  data: () => ({
    project: null,
    content: null,
    asideHeight: 100,
    nextCase: null,
    observer: null
  }),
  computed: {
    ...mapGetters(['blackCases', 'mainCases'])
  },
  async created() {
    this.$emit('toggle-dark', false)

    document.querySelector('body').classList.add('page--white')

    await this.setCase()
    this.setNextCase()
    this.observe()
    this.startPreviews()
  },
  destroyed() {
    document.querySelector('body').classList.remove('page--white')
    loop.remove(this.setAsideHeight.bind(this), 'setAsideHeight')
  },
  methods: {
    setAsideHeight() {
      if (this.$refs.aside) this.asideHeight = this.$refs.aside.offsetHeight
    },
    async setCase() {
      const slug = this.$route.params.id

      const cases = [...this.blackCases, ...this.mainCases]
      let stop = false

      // Ищем кейс в сторе
      cases.forEach(v => {
        if (v.slug === slug && !stop) {
          stop = true
          this.project = v
        }
      })

      // Тянем из API
      if (!this.project) {
        this.project = await fetchCase(slug)
      }

      // Rich content
      this.content = this.project.content.content

      loop.add(this.setAsideHeight.bind(this), 'setAsideHeight')
    },
    setNextCase() {
      let caseList = []

      this.blackCases.forEach(v => {
        if (v.slug === this.$route.params.id) caseList = [...this.blackCases]
      })
      this.mainCases.forEach(v => {
        if (v.slug === this.$route.params.id) caseList = [...this.mainCases]
      })

      caseList = caseList.filter(
        v => v.slug !== this.$route.params.id && !v.soon
      )

      if (caseList.length > 0) {
        const { title, subtitle, slug } = caseList[
          Math.floor(Math.random() * caseList.length)
        ]

        this.nextCase = {
          title,
          subtitle,
          to: `/case/${slug}`
        }
      } else {
        this.nextCase = {
          title: 'About',
          subtitle: 'Digital designer & art director from St.Petersburg',
          to: '/about'
        }
      }
    },
    observe() {
      const elements = this.$el.querySelectorAll(`.case__title,
      .case__title + p,
      .case__cover,
      .case__img,
      .case aside li,
      .case__content > li,
      .case__footer > li`)

      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      })

      elements.forEach(el => {
        this.observer.observe(el)
      })
    },
    onBaseImageComplete(img) {
      this.observer.observe(img)
    },
    startPreviews() {
      if (this.project.stories && this.project.stories.length > 1)
        this.$nextTick(this.$refs.preview.start)
    },
    render: item => documentToHtmlString(item),
    isText: item => item.nodeType === 'paragraph',
    isImage: item =>
      item.nodeType === 'embedded-asset-block' && isImage(item.data.target),
    isVideo: item =>
      item.nodeType === 'embedded-asset-block' && isVideo(item.data.target),
    isBlock: item =>
      item.nodeType === 'embedded-entry-block' &&
      ['row', 'box', 'mobileBox'].includes(
        item.data.target.sys.contentType.sys.id
      ),
    isRow: item =>
      item.nodeType === 'embedded-entry-block' &&
      item.data.target.sys.contentType.sys.id === 'row',
    isBox: item =>
      item.nodeType === 'embedded-entry-block' &&
      item.data.target.sys.contentType.sys.id === 'box',
    isMobileBox: item =>
      item.nodeType === 'embedded-entry-block' &&
      item.data.target.sys.contentType.sys.id === 'mobileBox',
    isWideslider: item =>
      item.nodeType === 'embedded-entry-block' &&
      item.data.target.sys.contentType.sys.id === 'wideslider'
  },
  watch: {
    async $route() {
      this.project = null
      await this.setCase()
      this.setNextCase()
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

// Case
.page:not(.dark) .case
  @media (max-width: 700px)
    background: #fff

.case
  font-size: 18px
  line-height: 1.6

  margin-left: auto
  margin-right: auto
  width: column-spans(8)
  min-height: 100vh
  padding-top: 11.5%
  padding-bottom: 10.5%

  @media (max-width: 900px)
    width: column-spans(10)

    width: 100%
    padding-left: var(--unit)
    padding-right: var(--unit)

    padding-top: 33%
    padding-bottom: 35.8%

// Title
.case__title
  line-height: 1
  margin-bottom: 0.65em

// Content
.case >
  h1, p
    width: column-spans(4)
    margin-left: column-spans(4)

    @media (max-width: 900px)
      margin-left: 0
      width: 100%

.case__img,
.case__content /deep/ img,
.case__content /deep/ video
  @media (max-width: 500px)
    user-select: none
    pointer-events: none

.case__content > li >
  h2, h3,
  ul, ol,
  a, p
    width: column-spans(4)
    margin-left: column-spans(4)

    @media (max-width: 900px)
      margin-left: 0
      width: 100%

.case__content /deep/ a > b
  position: relative

.case__content /deep/ a > b::before
  content: ''
  position: absolute
  bottom: -4px
  left: 0

  width: 100%
  height: 1px

  background: var(--color-text-lt)
  transform-origin: 100% 50%
  transition: $trs

.case__content /deep/ a:hover > b::before
  transform: scaleX(0)

.case__box--no-mb + li > .case__img
  margin-top: 0

.case__block
  @media (min-width: 901px)
    width: column-spans(10)
    margin-left: calc(-1 * #{mix(1)})

.case__text + li .wideslider,
.case__text + .case__block
  margin-top: 8.3%

  @media (max-width: 700px)
    margin-top: 80px

// Paragraph
.case p
  margin-bottom: 24px

.case__team /deep/ b
  +tt(m)

.case__team li:not(:first-child) /deep/ b
  display: block
  margin-top: 16px

.case__team p
  margin-bottom: 0

// Cover
.case__cover
  position: relative

.case__cover .case__img:not(video)
  @media (max-width: 700px)
    object-fit: cover
    height: 100vh


// Preview
.case__preview
  pointer-events: auto
  position: absolute
  right: calc(-1 * #{mix(2)})
  bottom: 4.5%
  @media (max-width: 900px)
    right: 0

// Images
.case__img
  display: block
  width: 100vw
  height: auto
  margin: 10.4% 0 10.4% calc(-1 * #{mix(2)} - #{var(--unit)})

  @media (max-width: 900px)
    margin: 48px 0 48px calc(-1 * #{var(--unit)})

// Footer
.case__footer
  padding-top: 4%

.case__footer > li
  min-height: 7em
  padding-top: 1.8em
  padding-bottom: 1.4em

  position: relative

.case__footer > li::before
  content: ''
  position: absolute
  bottom: 0
  left: 0

  width: 100%
  height: 1px
  background: var(--color-text-lt)
  opacity: 0.1

.case__footer-col:first-child
  // margin-right: gutters(1)

  // @media (max-width: 900px)
  //   margin-right: 16px

  @media (max-width: 700px)
    margin-right: 0
    width: column-spans(3)

.case__footer-col
  width: column-spans(4)

  @media (max-width: 900px)
    width: column-spans(5)

.case__footer-col:last-child
  @media (max-width: 700px)
    padding-left: 56px
    width: column-spans(9)
  @media (max-width: 360px)
    padding-left: 40px

.case__footer-col b
  +tt(m)


// Aside
aside
  max-width: 11em
  float: left

  @media (max-width: 900px)
    margin-bottom: 80px
    max-width: 80%
    float: unset

.case aside b
  +tt(m)

.case aside li
  margin-bottom: 32px

// OBSERVE ANIMATION
.case__title,
.case__title + p,
.case__img,
.case aside li,
.case__content > li,
.case__footer > li
  opacity: 0
  transition: .9s cubic-bezier(.215,.61,.355,1)

  &.visible
    opacity: 1

.case aside li,
.case__footer > li
  transform: translateY(16px)

  &.visible
    transform: translateY(0)

@for $i from 1 through 4
  .case aside li,
  .case__footer > li
    &:nth-child(#{$i})
      transition: 0.4s cubic-bezier(.25,.1,.25,1) (#{$i*0.05s})
</style>
