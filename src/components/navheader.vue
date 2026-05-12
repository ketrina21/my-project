<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"><Fold /></el-icon>
            <ul class="flex-box">
                <li 
                    v-for="(item, index) in selectMenu" 
                    :key="item.path" 
                    class="flex-box tab"
                    :class="{'selected': item.path === route.path}"
                    >
                    <el-icon  size="12">
                        <component :is="item.icon" />
                    </el-icon>
                    <router-link class="text flex-box" :to="item.path">{{ item.name }}</router-link>
                    <el-icon  size="12" class="close" @click="closeTab(item,index)"><close /></el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right">
             <el-dropdown @command="handleClick">
                <span class="el-dropdown-link flex-box">
                <el-avatar :src="userInfo.avatar" />   
                <p class="user-name">{{ userInfo.name }}</p>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="cancel">退出</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template> 
<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue';
import {useRoute,useRouter} from 'vue-router'

const userInfo=JSON.parse(localStorage.getItem('pz_userInfo'))


//当前路由
const route = useRoute()
const router = useRouter()
const store = useStore()
const selectMenu = computed(() => store.state.menu.selectMenu)

// 点击下拉菜单的回调
const handleClick = (command) => {
    if(command === 'cancel'){
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        localStorage.removeItem('pz_v3pz')
        window.location.href = window.location.origin
    }
}



// 关闭tab
const closeTab = (item,index) => {
    store.commit('closeMenu',item)
    //删除非当前页
    if(route.path !== item.path){
        return
    }
    const selectMenuData = selectMenu.value
    //删除的是最后一页
    if(index === selectMenuData.length ){
        //如果tag只有一个元素
        if(!selectMenuData.length){
            router.push('/')
        }
        //如果tag有多个元素
        else{
            router.push({path: selectMenuData[index - 1].path})
        }
    }
    //删除的是中间页
    else{
        router.push({path: selectMenuData[index].path})
    }
}



</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left {
        height: 100%;
        .icon {
            width: 45px;
            height: 100%;
        }
        .icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }
        .tab {
            padding: 0 10px;
            height: 100%;
            .text {
                margin: 0 5px;
            }
            .close {
                visibility: hidden;
            }
            &.selected {
                background-color: #f5f5f5;
                a {
                    color: #409eff;
                }
                i {
                    color: #409eff;
                }
            }
        }
        .tab:hover {
            background-color: #f5f5f5;
            .close {
                visibility: visible;
                cursor: pointer;
                color: #000;
            }
        }

    }
    .header-right {
        .user-name {
            margin-left: 10px;
        }
    }
    a {
        height: 100%;
        color: #333;
        font-size: 15px;
    }
}

</style>