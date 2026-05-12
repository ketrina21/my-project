<template>
  <el-menu 
  :style="{width:isCollapse ? '64px' : '230px'}" 
  active-text-color="#ffd04b" 
  background-color="#545c64" 
  class="aside-container" 
  text-color="#fff"
  @open="handleOpen"
  @close="handleClose"
  :is-collapse="isCollapse"
  :default-active="menuActive"
  >
    <p class="logo-lg">{{isCollapse ? 'DIDI' : 'DIDI陪诊'}}</p>
    <TreeMenu  :index="1" :menuData="menuData"  ></TreeMenu>
  </el-menu>
  
</template>
<script setup>
import TreeMenu from './treeMenu.vue'
import { useRouter } from 'vue-router'
import { reactive ,computed} from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const router = useRouter()
// const menuData=reactive(router.options.routes[0].children)
const menuData = computed(()=>store.state.menu.routerList)
const menuActive = computed(()=>store.state.menu.menuActive)



const isCollapse = computed(() =>  store.state.menu.isCollapse)


const handleOpen = () => {

}
const handleClose = () => {

}
</script>
<style lang="less" scoped>
.aside-container {
  height: 100%;

  .logo-lg {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
}

</style>
