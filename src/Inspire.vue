<template>
  <main class="inspire">
    <p class="inspire__filter">
      Показать по
      <Dropdown
        class="inspire__dropdown"
        v-if="types && types.length > 0"
        :list="types"
        @click="onDropdownClick($event, 'filterType')"
      />
      среди
      <Dropdown
        class="inspire__dropdown"
        v-if="categories && categories.length > 0"
        :list="categories"
        @click="onDropdownClick($event, 'filterCategory')"
      />
    </p>
    <ul class="inspire__list" ref="list">
      <li class="inspire__li" v-for="item in filteredList" :key="item.sys.id">
        <div class="inspire-block">
          <a :href="item.fields.url" target="_blank">
            <ImageDecode
              v-if="isImage(item.fields.image)"
              class="inspire-block__img"
              :src="item.fields.image.fields.file.url"
              :alt="item.fields.image.fields.title"
            />
            <video
              v-if="isVideo(item.fields.image)"
              class="inspire-block__img"
              :src="item.fields.image.fields.file.url"
              playsinline
              autoplay
              muted
              loop
            />
          </a>

          <div class="inspire-block__bar">
            <!-- <ul class="inspie-block__tags">
              <li v-for="type in item.fields.types" :key="type.sys.id">
                {{ type.fields.text }}
              </li>
              <li v-for="cat in item.fields.categories" :key="cat.sys.id">
                {{ cat.fields.text }}
              </li>
            </ul> -->
            <a
              :href="item.fields.url"
              target="_blank"
              class="inspire-block__name"
              >{{ item.fields.name }}
            </a>
          </div>
        </div>
      </li>
    </ul>

    <button class="inspire-more" @click="load" v-show="!hideMoreButton">
      Load more
    </button>
  </main>
</template>

<script>
import anime from 'animejs'
import Dropdown from '@/Dropdown'
import ImageDecode from '@/ImageDecode'

import { fetchInspire } from '@/scripts/api'
import { isImage, isVideo } from '@/scripts/helpers'

const getUnique = (list, key) => {
  var arr = []

  list.forEach(item => {
    item.fields[key].forEach(cat => {
      if (arr.map(({ fields }) => fields.slug).indexOf(cat.fields.slug) === -1)
        arr.push(cat)
    })
  })

  return arr
}

export default {
  name: 'Inspire',
  components: {
    ImageDecode,
    Dropdown
  },
  data: () => ({
    hideMoreButton: false,
    list: [],
    filterType: 'all',
    filterCategory: 'all',
    limit: 12,
    skip: 0
  }),
  computed: {
    filteredList() {
      return (
        this.list
          // Type
          .filter(({ fields }) => {
            if (this.filterType === 'all') return true
            const types = fields.types.map(type => type.fields.slug)
            return types.indexOf(this.filterType) !== -1
          })
          // Category
          .filter(({ fields }) => {
            if (this.filterCategory === 'all') return true
            const cats = fields.categories.map(category => category.fields.slug)
            return cats.indexOf(this.filterCategory) !== -1
          })
      )
    },
    categories() {
      const all = {
        fields: { text: 'everything', slug: 'all' },
        sys: { id: new Date() + 'categories' }
      }

      return [all, ...getUnique(this.list, 'categories')]
    },
    types() {
      const all = {
        fields: { text: 'everything', slug: 'all' },
        sys: { id: new Date() + 'types' }
      }

      return [all, ...getUnique(this.list, 'types')]
    }
  },
  created() {
    this.$emit('toggle-dark', false)
    this.load()
  },
  methods: {
    isImage,
    isVideo,
    async load() {
      const { limit, skip } = this

      const newList = await fetchInspire({ limit, skip })
      this.list = [...this.list, ...newList]
      // .sort((a, b) => b.fields.year - a.fields.year)
      this.skip += limit

      this.hideMoreButton = newList.length !== this.limit
    },
    onDropdownClick({ fields }, key) {
      if (this[key] === fields.slug) return false

      const list = this.$refs.list

      anime({
        targets: list,
        duration: 400,
        easing: 'cubicBezier(.165,.84,.44,1)',
        opacity: [1, 0],
        translateY: ['0px', '-80px'],
        complete: () => {
          this[key] = fields.slug

          anime({
            targets: list,
            duration: 600,
            easing: 'cubicBezier(.165,.84,.44,1)',
            opacity: [0, 1],
            translateY: ['80px', '0px']
          })
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

.inspire
  padding: 24vh var(--unit)

.inspire__filter
  margin-bottom: 120px

.inspire__dropdown
  display: inline-block
  vertical-align: top
  text-transform: lowercase
  line-height: 1.4
  margin-top: -1px

.inspire__list
  display: flex
  flex-wrap: wrap
  margin-top: calc(-1 * #{gutters(1)})
  margin-left: calc(-1 * #{gutters(1)})

  @media (max-width: 900px)
    margin-left: 0

.inspire__li
  margin-top: gutters(1)
  margin-left: gutters(1)
  width: calc(50% - #{gutters(1)})

  @media (max-width: 900px)
    margin-left: 0
    width: 100%

.inspire-block
  display: flex
  align-items: center
  justify-content: center
  padding: 12%

  position: relative
  background: #ddd

.inspire-block__img
  display: block
  max-width: 100%
  width: 100%
  height: auto

// .inspie-block__tags
//   display: flex

.inspire-block__bar
  position: absolute
  bottom: 0
  left: 0
  padding: 0 16px 16px

  width: 100%
  display: flex
  align-items: flex-start
  justify-content: space-between

.inspire-more
  display: block
  margin: 40px auto
  text-transform: uppercase
</style>
