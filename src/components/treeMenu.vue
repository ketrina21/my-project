<template>
    <template v-for="(item, index) in props.menuData" :key="`${props.index}-${item.meta.id}`">
        <el-menu-item @click="handleClick(item, `${props.index}-${item.meta.id}`)"
            v-if="!item.children || item.children.length === 0" :index="`${props.index}-${item.meta.id}`">
            <el-icon size="20">
                <component :is="item.meta.icon" />
            </el-icon>
            <span class="menu-name">{{ item.meta.name }}</span>
        </el-menu-item>
        <!--有子菜单-->
        <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
            <template #title>
                <el-icon size="20">
                    <component :is="item.meta.icon" />
                </el-icon>
                <span class="menu-name">{{ item.meta.name }}</span>
            </template>
            <treeMenu :index="`${props.index}-${item.meta.id}`" :menuData="item.children" />
        </el-sub-menu>
    </template>
</template>


<script setup>
import { useRouter } from 'vue-router'
import {useStore} from 'vuex'


const store = useStore()

const router = useRouter()
const handleClick = (item, active) => {
    router.push(item.meta.path)
    store.commit('addMenu',item.meta)
    store.commit('updatemenuActive',active)
}


const props = defineProps(['index', 'menuData'])
</script>

<style scoped>
.menu-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
