export const menus = [
  {
    key: 'dashboard',
    title: '首页',
    path: '/dashboard',
    icon: 'icon-park-outline:home',
  },
  {
    key: 'quickForm',
    title: '快捷表单生成',
    path: '/examples/quickForm',
    icon: 'icon-park-outline:user',
  },
  {
    key: 'noAuth',
    title: '无权限页面',
    path: '/examples/noAuth',
    icon: 'icon-park-outline:permissions',
  },
  {
    key: 'userList',
    title: '404',
    path: '/xxx',
    icon: 'icon-park-outline:error',
  },
  {
    key: 'examples',
    title: '页面示例',
    icon: 'icon-park-outline:user',
    children: [
      {
        key: 'user',
        title: '用户管理',
        path: '/examples/user',
        icon: 'icon-park-outline:user',
      },
      {
        key: 'role',
        title: '角色管理',
        path: '/examples/role',
        icon: 'icon-park-outline:user',
      },
      {
        key: 'log',
        title: '日志管理',
        path: '/examples/log',
        icon: 'icon-park-outline:user',
      },
    ],
  },
]
