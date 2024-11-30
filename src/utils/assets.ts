// 基础路径，从环境变量或配置中获取
const BASE_PATH = import.meta.env.VITE_BASE_PATH || ''

/**
 * 获取图片路径
 * @param path 相对路径
 * @returns 完整路径
 */
export const getStaticPath = (path: string) => {
  const cleanPath = path.replace('/public/', '/')
  return process.env.NODE_ENV === 'production'
    ? `${BASE_PATH}${cleanPath}`
    : cleanPath
    // ? `${import.meta.env.BASE_URL}${cleanPath}`
    // : cleanPath
}

/**
 * 获取静态资源 URL
 * @param url 资源路径
 * @returns 完整 URL
 */
export const getAssetUrl = (url: string) => {
  if (url.startsWith('http')) {
    return url
  }
  return new URL(url, import.meta.url).href
} 