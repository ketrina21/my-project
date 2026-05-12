const localData = localStorage.getItem('pz_v3pz')
const state = localData ? localData.menu : {
    isCollapse: false,
    selectMenu:[],
    routerList:[],
    menuActive:'1-1'
}


const mutations = {
    // 切换菜单折叠状态
    collapseMenu(state){
        state.isCollapse = !state.isCollapse
    },
    addMenu(state,payload){
        if(state.selectMenu.findIndex(item => item.path === payload.path)===-1){
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state,payload){
        const index = state.selectMenu.findIndex(item => item.path === payload.path)
        state.selectMenu.splice(index,1)
    },
    dynamicMenu(state,payload){
        //通过glob导入文件
        const modules = import.meta.glob('../views/**/**/*.vue')
        function routerSet(router){
            router.forEach(route => {
                //判断没有子菜单，拼接路由数据
                if(!route.children){
                    const url=`../views${route.meta.path}/index.vue`
                    //拿到获取的vue组件
                    route.component = modules[url]
                }
                else{//有子菜单，递归调用
                    routerSet(route.children)
                }
            })
        }
        routerSet(payload)
        //拿到完整的路由数据
        state.routerList = payload
    },
    updatemenuActive(state,payload){
        state.menuActive = payload
    }
}

export default {
    mutations,
    state
}