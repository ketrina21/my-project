import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import PanelHeader from './components/panelHeader.vue'

//刷新后的动态路由添加
const localData = localStorage.getItem('pz_v3pz')
if(localData){
  store.commit('dynamicMenu',JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach(item=>{
    router.addRoute('main',item)
  })
}

//路由守卫
router.beforeEach((to, from) => {
  //token不存在且为非登录页面
  const token = localStorage.getItem('pz_token')
    if(!token && to.path !== '/login'){
      router.push('/login')
      return
    }else if(token && to.path === '/login'){
      router.push('/')
      return
    }
    else{
      return true
    }
})



import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { lo } from 'element-plus/es/locale/index.mjs'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('PanelHeader', PanelHeader)



// 挂载路由
app.use(router)
// 挂载vuex
app.use(store)
app.mount('#app')
