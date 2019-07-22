const contentful = require('contentful')

// Get keys
const space = process.env.VUE_APP_SPACE_ID
const accessToken = process.env.VUE_APP_ACCESS_TOKEN
const BLACK_ID = process.env.VUE_APP_BLACK_ID
const MAIN_ID = process.env.VUE_APP_MAIN_ID

// Client instance
const client = contentful.createClient({ accessToken, space })

export const fetchCases = ctx => {
  // Get black
  client.getEntry(BLACK_ID).then(({ fields }) => {
    const cases = []

    fields.list.forEach(v => {
      const proj = { ...v.fields }

      // Set content type
      proj.covers.forEach(cover => {
        cover.fields.type = cover.fields.file.contentType.split('/')[0]
      })

      cases.push(proj)
    })

    ctx.$store.dispatch('setCases', { black: true, cases })
  })

  // Get main
  client.getEntry(MAIN_ID).then(({ fields }) => {
    const cases = []

    fields.list.forEach(v => {
      const proj = { ...v.fields }

      // Set content type
      proj.covers.forEach(cover => {
        cover.fields.type = cover.fields.file.contentType.split('/')[0]
      })

      cases.push(proj)
    })

    ctx.$store.dispatch('setCases', { black: false, cases })
  })
}

export const fetchCase = slug =>
  new Promise(resolve => {
    // Get black
    client
      .getEntries({
        content_type: 'case',
        'fields.slug': slug
      })
      .then(({ items }) => {
        resolve(items[0] ? items[0].fields : null)
      })
  })
