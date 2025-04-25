import type { RouteLocationNormalized, RouteMeta } from 'vue-router'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TagView extends Partial<RouteLocationNormalized<any>> {
  title?: string
  path: string
  name?: string
  query?: Record<string, any>
  meta?: RouteMeta & {
    title?: string
    affix?: boolean
    keepAlive?: boolean
  }
}

export const useTagsViewStore = defineStore('tagsView', () => {
  const visitedViews = ref<TagView[]>([])
  const cachedViews = ref<string[]>([])
  const sideMenuStore = useMenuStore()
  const route = useRoute()
  const router = useRouter()

  const addView = (view: RouteLocationNormalized) => {
    addVisitedView(view)
    addCachedView(view)
  }

  function addVisitedView(view: RouteLocationNormalized) {
    // 查找菜单项
    let menuTitle = ''
    const menus = sideMenuStore.menus?.flatMap((item: any) => item.children ? item.children : item)
    const menu = menus?.find((item: any) => (item.path && item.path === view.path) || (item.name && item.name === view.name))
    if (menu && menu.title) {
      menuTitle = menu.title
    }
    else if (view.meta?.title) {
      menuTitle = view.meta.title as string
    }
    else if (view.name) {
      menuTitle = String(view.name)
    }
    else {
      menuTitle = (view as RouteLocationNormalized).path
    }

    const existingView = visitedViews.value.find(v =>
      v.path === view.path && JSON.stringify(v.query) === JSON.stringify(view.query),
    )

    if (existingView) {
      // 如果存在，更新它
      Object.assign(existingView, {
        name: view.name?.toString(),
        meta: view.meta,
        title: menuTitle,
      })
    }
    else {
      visitedViews.value.push(
        Object.assign({}, view, {
          name: view.name?.toString(),
          title: menuTitle,
        }) as TagView,
      )
    }
  }

  function addCachedView(view: RouteLocationNormalized) {
    if (view.name && !cachedViews.value.includes(view.name as string)) {
      if (view.meta?.keepAlive)
        cachedViews.value.push(view.name as string)
    }
  }

  const delView = (view: TagView) => {
    return new Promise((resolve) => {
      console.log(visitedViews)
      delVisitedView(view)
      delCachedView(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      })
    })
  }

  function delVisitedView(view: TagView) {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter(v =>
        !(v.path === view.path && JSON.stringify(v.query) === JSON.stringify(view.query)),
      )
      resolve([...visitedViews.value])
    })
  }

  function delCachedView(view: TagView) {
    return new Promise((resolve) => {
      if (view.name) {
        const index = cachedViews.value.indexOf(view.name as string)
        index > -1 && cachedViews.value.splice(index, 1)
      }
      resolve([...cachedViews.value])
    })
  }

  function delOthersViews(view: TagView) {
    return new Promise((resolve) => {
      delOthersVisitedViews(view)
      delOthersCachedViews(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      })
    })
  }

  function delOthersVisitedViews(view: TagView) {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter((v) => {
        return v.meta?.affix
          || (v.path === view.path && JSON.stringify(v.query) === JSON.stringify(view.query))
      })
      resolve([...visitedViews.value])
    })
  }

  function delOthersCachedViews(view: TagView) {
    return new Promise((resolve) => {
      if (view.name) {
        const index = cachedViews.value.indexOf(view.name as string)
        if (index > -1)
          cachedViews.value = cachedViews.value.slice(index, index + 1)
        else
          cachedViews.value = []
      }
      resolve([...cachedViews.value])
    })
  }

  function delAllViews() {
    return new Promise((resolve) => {
      delAllVisitedViews()
      delAllCachedViews()
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      })
    })
  }

  function delAllVisitedViews() {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter(tag => tag.meta?.affix)
      resolve([...visitedViews.value])
    })
  }

  function delAllCachedViews() {
    return new Promise((resolve) => {
      cachedViews.value = []
      resolve([...cachedViews.value])
    })
  }

  function updateVisitedView(view: TagView) {
    for (let v of visitedViews.value) {
      if (v.path === view.path && JSON.stringify(v.query) === JSON.stringify(view.query)) {
        v = Object.assign(v, view)
        break
      }
    }
  }

  function checkIsActive(tag: TagView) {
    return tag.path === route.path && JSON.stringify(tag.query) === JSON.stringify(route.query)
  }

  function closeTag(tag: TagView) {
    delView(tag).then(({ visitedViews }: any) => {
      if (checkIsActive(tag)) {
        if (visitedViews.length < 1) {
          router.push('/')
        }
        else {
          const latestView = visitedViews[visitedViews.length - 1]

          router.push({
            path: latestView.path,
            query: latestView.query,
          })
        }
      }
    })
  }
  return {
    visitedViews,
    cachedViews,
    addView,
    addVisitedView,
    addCachedView,
    delView,
    delVisitedView,
    delCachedView,
    delOthersViews,
    delOthersVisitedViews,
    delOthersCachedViews,
    delAllViews,
    delAllVisitedViews,
    delAllCachedViews,
    updateVisitedView,
    checkIsActive,
    closeTag,
  }
})
