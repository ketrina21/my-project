<template>
    <PanelHeader :route="route" />
    <div class="btns">
        <el-button type="primary" :icon="Plus" @click="open(null)" size="small">新增</el-button>
    </div>
    <!--表格 -->
    <el-table :data="tableData.list" style="width: 100%">
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="name" label="昵称"/>
        <el-table-column prop="permissionName" label="菜单权限" width="500px"/> 
        <el-table-column  label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table> 
    <!-- 分页 -->
    <div class="pagination-info">
      <el-pagination
            v-model:current-page="paginationData.pageNum"
            :page-size="paginationData.pageSize"
            :background="false"
            size="small"
            layout="total, prev, pager, next"
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />
    </div>
    <!--弹窗 -->
    <el-dialog 
        v-model="dialogFormVisible"
        :before-close="beforeClose"
        title="添加权限"
        width="500"
    >
        <el-form
        ref="formRef"
        label-width="100px"
        label-position="left"
        :model="form"
        :rules="rules"
        >   
        <el-form-item  prop="id">
            <el-input v-show="false" ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请填写权限名称"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permission">
            <el-tree
                ref="treeRef"
                :data="permissionData"
                style="max-height: 600px"
                node-key="id"
                show-checkbox
                :default-checked-keys="defaultKeys"
                :default-expanded-keys="[2]"
            />
        </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="confirm(formRef)">确定</el-button>
        </template>
    </el-dialog>
</template> 
<script setup>
import { ref,reactive,onMounted,nextTick } from 'vue'
import { userGetMenu,userSetMenu,menuList } from '../../../api/index'
import { ElTableColumn } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
const route = useRoute()

onMounted(()=>{
    userGetMenu().then(({data})=>{
        permissionData.value = data.data
    })
    getListData()
})
//列表数据
const tableData = reactive({
    list:[],
    total:0
})

//打开弹窗
const open=(rowData={})=>{
    dialogFormVisible.value = true
    //弹窗打开form生成是异步的
    nextTick(()=>{
        if(rowData){
            Object.assign(form, {id:rowData.id,name:rowData.name})
            treeRef.value.setCheckedKeys(rowData.permission)
        }
    })
}


const  paginationData   = reactive({
    pageNum:1,
    pageSize:10,
})


//获取菜单权限列表
const getListData=()=>{
    menuList(paginationData).then(({data})=>{
        const {list,total}=data.data
        tableData.list=list
        tableData.total=total
    })
}
//点击页码的回调
const handleSizeChange=(val)=>{
    paginationData.pageSize=val
    getListData()
}
//点击当前页的的回调
const handleCurrentChange=(val)=>{
    paginationData.pageNum=val
    getListData()
}
//表单实例
const formRef = ref()

//表单数据
const form = reactive({
    name: '',
    permission: '',
    id: ''

})
//权限数据
const permissionData = ref([])

//弹窗是否显示
const dialogFormVisible = ref(false)

//关闭窗体的回调
const beforeClose = () => {
    dialogFormVisible.value = false
    //重置表单数据
    formRef.value.resetFields()
    //tree手动重置
    treeRef.value.setCheckedKeys(defaultKeys)
}
//表单校验规则
const rules = reactive({
    name: [
        { required: true, message: '请输入权限名称', trigger: 'blur' }
    ]

})



//选中的权限
const defaultKeys = [4,5]
//树组件实例
const treeRef = ref()
//确认提交
const confirm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            const permissions=JSON.stringify(treeRef.value.getCheckedKeys())
            userSetMenu({name:form.name,permissions,id:form.id}).then(({data})=>{
                beforeClose()
                getListData()
            })
            
        }
         else {
             console.log('error submit', fields);
        }
    })
}

</script>
<style lang="less" scoped>
.btns{
    padding:10px 0 10px 10px;
    background: #fff;
}
</style>