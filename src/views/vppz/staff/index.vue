<template>
    <div class="btns">
        <el-button type="primary" :icon="Plus" @click="open(null)" size="small">新增</el-button>
        <el-popconfirm
            confirm-button-text="是"
            cancel-button-text="否"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="是否确认删除？"
            @confirm="confirmEvent"
            >
            <template #reference>
                <el-button type="danger" :icon="Delete" size="small">删除</el-button>
            </template>
        </el-popconfirm>
    </div>
    <el-table :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="selectable" width="55" />
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="name" label="昵称"/>
        <el-table-column label="头像">
            <template #default="scope">
                <el-image 
                    :src="scope.row.avatar"
                    style="width: 50px; height: 50px;"
                    ></el-image>
            </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别">
            <template #default="scope">
                {{scope.row.sex === '1' ? '男' : '女'}}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"/>
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '禁用' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column  label="创建时间">
            <template #default="scope">
                <div class="flex-box">
                    <el-icon><Clock /></el-icon>
                    <span style="margin-left: 10px;">{{ scope.row.create_time }}</span> 
                </div>
            </template>
        </el-table-column>
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
    <el-dialog 
            v-model="dialogFormVisible"
            :before-close="beforeClose"
            title="陪护师添加"
            width="500"
        >
        <el-form
            ref="formRef"
            label-width="100px"
            label-position="left"
            :model="form"
            :rules="rules" 
        >
            <el-form-item v-show="false" prop="id">
                <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisible=true">点击上传</el-button>
                <el-image 
                    v-else :src="form.avatar"
                    style="width: 100px; height: 100px;"
                    ></el-image>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择性别">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input-number v-model="form.age" :min="18" :max="50"/>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="是否激活" prop="active">
                <el-radio-group v-model="form.active">
                    <el-radio :value="0" >失效</el-radio>
                    <el-radio :value="1" >生效</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="confirm(formRef)">确定</el-button>
        </template>
    </el-dialog>
    <el-dialog 
            v-model="dialogImgVisible"
            :before-close="beforeClose"
            title="选择图片"
            width="680"
        >
        <div class="image-list">
            <div v-for="(item,index) in fileList" :key="item.name" class="img-box" @click="selectIndex=index">
                <div v-if="selectIndex === index" class="select">
                    <el-icon color="#fff">
                        <Check />
                    </el-icon>
                </div>
                <el-image
                    style="width: 148px; height: 148px;"
                    :src="item.url"
                />
            </div>
        </div>
        <template #footer>
            <el-button @click="dialogImgVisible=false">取消</el-button>
            <el-button type="primary" @click="confirmImage()">确定</el-button>
        </template>
        </el-dialog>
</template> 
<script setup>
import { id } from 'element-plus/es/locale/index.mjs';
import { ref , reactive,onMounted ,nextTick}  from 'vue'
import { Plus,InfoFilled,Delete } from '@element-plus/icons-vue'
import { photoList,companion,companionList } from '../../../api'

const paginationData = reactive({
    pageNum:1,
    pageSize:10,
})
const tableData = reactive({
    list:[],
    total:0,
})
//获取陪护师列表
const getListData = () => {
    companionList(paginationData).then(({ data }) => {
        const {list,total} = data.data
        tableData.list = list
        tableData.total = total
    })
}

const dialogFormVisible = ref(false)
//选择头像弹窗
const dialogImgVisible = ref(false)
//陪护师头像列表
const fileList=ref([])
//选中的头像
const selectIndex=ref(0)
const formRef = ref()
const form=reactive({
    id:'',
    mobile:'',
    name:'',
    active:1,
    age:18,
    avatar:'',
    sex:''

})
//表单校验规则
const rules = reactive({
    name: [{ required: true, message: '请填写昵称', trigger: 'blur' }],
    mobile: [{ required: true, message: '请填写手机号', trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别' }],
    avatar: [{ required: true, message: '请选择头像'}],
})
//打开弹窗
const open = (rowData={}) => {
    dialogFormVisible.value = true
    nextTick(()=>{
        //如果是编辑
        if(rowData){
            Object.assign(form,rowData)
        }
    })
}

// 关闭弹窗
const beforeClose = () => {
    dialogFormVisible.value = false
    formRef.value.resetFields()
}
//确认提交
const confirm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if(valid){
            companion(form).then(({data})=>{
                if(data.code === 10000){
                    ElMessage.success('创建成功')
                    beforeClose()
                    getListData()
                }
                else{
                    ElMessage.error(data.message)
                }
            })
        }
        else {
             console.log('error submit', fields);
        }
    })
}
//获取陪护师头像列表
onMounted(() => {
    photoList().then(({ data }) => {
        fileList.value = data.data
    })
    getListData()
    }
)
//确认选择图片
const confirmImage = () => {
    form.avatar = fileList.value[selectIndex.value].url
    dialogImgVisible.value = false
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
//选择陪护师的回调
const handleSelectionChange=(val)=>{
    console.log(val)
}

</script>
<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}

.image-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .img-box {
        position: relative;

        .select {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 24px;
            height: 24px;
            background-color: #67c23a;
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .el-image {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
</style>
