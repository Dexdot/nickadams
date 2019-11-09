export const isImage = ({ fields }) =>
  fields.file.contentType.split('/')[0] === 'image'

export const isVideo = ({ fields }) =>
  fields.file.contentType.split('/')[0] === 'video'

export const isJPG = img =>
  isImage(img) && img.fields.file.contentType.split('/')[1] === 'jpeg'
