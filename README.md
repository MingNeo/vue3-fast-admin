# vue3-fast-admin

> 一个专注于中后台页面与表单快速搭建的 Vue3 工程化模板，内置丰富的渐进式高扩展性组件，助力极速及优雅的开发。

## 特性

- ⚡️ Vue3 + Vite + Pinia + UnoCSS
- 🗂 文件路由自动生成
- 📦 组件自动加载
- 🏗️ 页面/表单快速搭建组件（详见下方“核心组件”）
- 🌍 国际化支持
- 📑 布局系统
-  I18n 国际化
- 📥 API 自动加载、自动Mock
- 🖨 vite-ssg 服务端生成 (SSG)
- ⚙️ Vitest 单元测试, Cypress E2E 测试
- 🧩 Storybook 组件预览
- 🏗️ **内置页面/表单快速搭建核心组件**（见下方"核心组件"）

## 使用
### 开发

推荐使用pnpm

```bash
pnpm install
```

本地服务 http://localhost:3333

```bash
pnpm dev
```

### 构建

构建该应用只需要执行以下命令

```bash
pnpm build
```

然后你会看到用于发布的 `dist` 文件夹被生成。

---

## 核心组件
使用 [Pro-el-components](https://mingneo.github.io/pro-el-components/)
### 1. ProFormFields
- **简介**：通过配置字段数组，自动生成表单块（而非表单），支持多类型、联动、校验、多个表单块及原生组件/dom 自由组合。
- **高级特性**：支持自定义组件、数组表单、字段联动、校验、布局灵活。
- **用法示例**：

```vue
<script setup>
const data = ref({ name: '', gender: '' })
const fields = ref([
  { label: '姓名', prop: 'name', type: 'input', required: true },
  { label: '性别', prop: 'gender', type: 'select', fieldProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] } }
])
const fields2 = ref([
  { label: '年龄', prop: 'age', type: 'input', required: true }
])
</script>

<template>
  <el-form :model="data">
    <ProFormFields v-model="data" :column="3" :fields="fields" />
    <p>
      中间可以混合任何其他组件或 html
    </p>
    <ProFormFields v-model="data2" :column="3" :fields="fields2" />
  </el-form>
</template>
```

### 2. [SearchForm 筛选项](https://mingneo.github.io/pro-el-components/components/SearchForm.html)
- **简介**：基于ProFormFields，通过配置字段，快速生成统一风格的查询表单，常用于列表页顶部。
- **用法示例**：

```vue
<script setup>
const fields = [
  { label: '用户名', prop: 'username', type: 'input' },
  { label: '性别', prop: 'gender', type: 'select', fieldProps: { options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] } }
]
</script>

<template>
  <SearchForm :fields="fields" />
</template>
```

### 3. [ListPage ListPage（列表页）](https://mingneo.github.io/pro-el-components/components/ListPage.html)
- **简介**： 基于ProFormFields及Table，通过配置字段，快速生成统一风格的列表页，常用于列表页顶部。
- **用法示例**：

```vue
<script setup>
const formData = ref([{ name: '', gender: '' }])
const columns = [
  { label: '姓名', prop: 'name', type: 'input', required: true },
  { label: '性别', prop: 'gender', type: 'select', options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] }
]
</script>

<template>
  <TableForm v-model="formData" :columns="columns" />
</template>
```

### 4. ModalForm（弹窗表单）
- **简介**：通过配置字段，快速生成弹窗表单，支持详情/编辑/新建等多种模式。
- **用法示例**：

```vue
<script setup>
const visible = ref(false)
const fields = [
  { prop: 'name', label: '姓名', required: true },
  { prop: 'age', label: '年龄', type: 'number' },
  { prop: 'address', label: '地址', type: 'textarea' }
]
const formData = reactive({ name: '', age: '', address: '' })
function handleSubmit(value) {
  console.log(value)
}
</script>

<template>
  <common-modal-form v-model="visible" :fields="fields" :default-value="formData" @ok="handleSubmit" />
</template>
```

### 5. [DetailPage 详情/编辑/新建页快速生成](https://mingneo.github.io/pro-el-components/components/DetailPage.html)
- **简介**：通过配置字段，快速生成详情、编辑、新建等多种状态的页面。
- **用法示例**：

```vue
<script setup>
const data = ref({})
const viewMode = ref(false)
const fields = [
  { label: '编码', prop: 'code', required: true },
  { label: '名称', prop: 'name' }
]
</script>

<template>
  <common-page-detail :fields="fields" :default-value="data" :view-mode="viewMode" />
</template>
```

### 路径别名

`@/`被别名为`./src/`文件夹。

### 自动import

自动导入无需手工引入以下模块
库

- vue
- vue-router
- vueuse
- vue-i18n
- icon-park

自动导入无需手工引入以下项目目录下文件

- composables
- stores
- utils
- components

自动导入无需引入及注册以下目录下组件,根据文件目录生成组件名，如components/common/HelloWord.vue可直接在
template中使用<CommonHelloWord /> 或 <common-hello-word />
- components

具体可参见自动生成的src/auto-imports.d.ts

### 路由

src/pages目录下的vue文件将自动生成路由。
该目录下的各页面目录内children、components下的文件将不会生成路由。

### 权限控制

#### 1、页面级权限控制

在页面组件中配置role、permission

```vue
<route lang="yaml">
meta:
  role: [admin]
</route>
```

#### 2、菜单权限控制

同页面级权限控制，根据路由path自动生成。可通过变量generateMenuByAuth控制是否开启

#### 3、按钮级权限控制

```vue
<el-button v-if="$hasAuth('demoList:del')">
Button
</el-button>
```

or

```js
const hasAuth = useAuth()
hasAuth('demoList:del')
```

### 图标
使用 [@iconify/vue](https://iconify.design/docs/icon-components/vue/)
```vue
<icon icon="icon-park-outline:back" />
```

如使用自定义图标，可在src/assets/iconify.json中配置。
如上传至iconfont，并配合(tampermonkey-iconfont-iconify油猴插件)[https://github.com/yee94/tampermonkey-iconfont-iconify]插件直接下载iconify.json文件覆盖即可。

### mock

mock目录下的文件将自动生成mock，当本地开发且未转发时可自动使用mock
