import { IBreadcrumb } from '@/base-ui/breadcrumb'
import menu from '@/router/main/system/menu/menu'
import user from '@/router/main/system/user/user'
import { RouteRecordRaw } from 'vue-router'

let firstMenu: any = null

export function mapMenusToRoutes(userMenus: any[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  // 1. 先去加载默认所有的routes
  const allRouters: RouteRecordRaw[] = []
  // require.context()是webpack支持的方法，
  // 第一个参数是文件夹的路径，第二个参数是是否需要递归，第三个参数是查找目标的条件
  const routeFiles = require.context('../router/main', true, /\.ts/) // 这里的意思是在router的main文件夹下递归查找所有的ts文件
  // routeFiles.keys()会返回string数组，其中的string就是我们的路径信息
  routeFiles.keys().forEach((key) => {
    const route = require('../router/main' + key.split('.')[1])
    allRouters.push(route.default)
  })
  // console.log(allRouters) // 打印所有路径

  // 2.根据菜单获取需要添加的routes
  // 菜单也就是userMenus, 从userMenus中获取type值，如果type = 1就是一级菜单，不需要映射，
  // 然后递归查找type值，直到type=2才停止。
  // 找到type=2后，就获取其url,然后将之添加到route中
  const _recurseGetRoute = (menus: any[]) => {
    for (const menu of menus) {
      if (menu.type == 2) {
        const route = allRouters.find((route) => route.path === menu.url)
        if (route) routes.push(route)
        if (!firstMenu) firstMenu = menu
      } else {
        _recurseGetRoute(menu.children)
      }
    }
  }
  _recurseGetRoute(userMenus)

  return routes
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function pathMapBreadcrumbs(userMenus: any[], currentPath: string) {
  const breadcrumbs: IBreadcrumb[] = []
  pathMapToMenu(userMenus, currentPath, breadcrumbs)
  return breadcrumbs
}

export function pathMapToMenu( // 由path匹配菜单
  userMenus: any[],
  currentPath: string,
  breadcrumbs?: IBreadcrumb[]
): any {
  for (const menu of userMenus) {
    if (menu.type === 1) {
      const findMenu = pathMapToMenu(menu.children ?? [], currentPath)
      if (findMenu) {
        breadcrumbs?.push({ name: menu.name })
        breadcrumbs?.push({ name: findMenu.name })
        return findMenu
      }
    } else if (menu.type === 2 && menu.url === currentPath) {
      return menu
    }
  }
}
export { firstMenu }

export function mapMenusToPermissions(userMenus: any[]) {
  const permissions: string[] = []
  const _recurseGetPermission = (menus: any[]) => {
    for (const menu of menus) {
      if (menu.type === 1 || menu.type === 2) {
        _recurseGetPermission(menu.children ?? [])
      } else if (menu.type === 3) {
        permissions.push(menu.permission)
      }
    }
  }

  _recurseGetPermission(userMenus)
  return permissions
}

export function menuMapLeafKeys(menuList: any[]) {
  const leftKeys: number[] = []

  const _recurseGetLeaf = (menuList: any[]) => {
    for (const menu of menuList) {
      if (menu.children) {
        _recurseGetLeaf(menu.children)
      } else {
        leftKeys.push(menu.id)
      }
    }
  }

  _recurseGetLeaf(menuList)

  return leftKeys
}
