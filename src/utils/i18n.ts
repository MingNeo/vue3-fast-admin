const instance = getCurrentInstance()!

export function t(key: string) {
  return instance.proxy.$t(key)
}
