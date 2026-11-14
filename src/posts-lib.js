import posts from './posts.json'

export { posts }

export const getPost = (id) => (id ? posts[id] : null)

export const postIdFrom = (url) => {
  const m = url && String(url).match(/status\/(\d+)/)
  return m ? m[1] : null
}

export const mediaThumb = (post) => {
  if (!post?.ok) return null
  if (post.article?.cover) return { src: post.article.cover, w: post.article.w, h: post.article.h, video: false, article: true }
  const m = post.media && post.media[0]
  if (!m) return null
  return { src: m.src || m.poster, w: m.w, h: m.h, video: m.type === 'video' || m.type === 'gif' }
}

export const formatDuration = (sec) => {
  if (!sec && sec !== 0) return null
  const s = Math.round(Number(sec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}
