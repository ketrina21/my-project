<template>
    <el-row class="login-container" justify="center" :align="`middle`">
        <el-card style="max-width: 480px">
            <template #header>
                <div class="card-header">
                    <img :src="imageUrl" alt="" >
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="handleChange">{{ formType ? '返回登陆':'注册账号' }}</el-link>
            </div>
            <el-form 
                :model="loginForm" 
                label-width="auto" 
                :rules="rules"
                ref="loginFormRef"
                >
                <el-form-item  prop="userName">
                    <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="UserFilled" />
                </el-form-item>
                <el-form-item  prop="passWord">
                    <el-input v-model="loginForm.passWord" type="password" placeholder="密码" :prefix-icon="Lock" />
                </el-form-item>
                <el-form-item v-if="formType" prop="validCode">
                    <el-input v-model="loginForm.validCode" placeholder="验证码" :prefix-icon="Lock" >
                        <template #append>
                        <span @click="countdownChange()">{{ countDown.vaildText }}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%" @click="submitForm(loginFormRef)">{{ formType ? '注册':'登录' }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
</template>
<script setup>
import { UserFilled ,Lock} from '@element-plus/icons-vue'
import {ref,reactive, toRaw, computed} from 'vue'
import { getCode,userAuthentication,login,menuPermissions } from '../../api/index'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'


const store = useStore()
//获取路由列表
const routerList = computed(()=>store.state.menu.routerList)

const router = useRouter()
const loginFormRef = ref()
//表单数据
const loginForm = reactive({
    userName: '',
    passWord: '',
    validCode: ''
})
const countDown = reactive({
    time: 60,
    vaildText: '获取验证码'
})
let flag = false//是否点击了验证码
let timer = null//定义定时器变量

//校验手机号
const validateUser = (rule, value, callback) => {
    //不能为空
    if(!value) {
        callback(new Error('请输入手机号'))
        return
    }
    //判断手机号是否正确
    const reg = /^1[3456789]\d{9}$/
    if(!reg.test(value)) {
        callback(new Error('请输入正确的手机号'))
        return
    }
    callback()
}
//校验密码
const validatePassword = (rule, value, callback) => {
    //不能为空
    if(!value) {
        callback(new Error('请输入密码'))
        return
    }
    //判断密码是否正确
    const reg = /^[a-zA-Z0-9_-]{4,16}$/
    if(!reg.test(value)) {
        callback(new Error('请输入正确格式的密码'))
        return
    }
    callback()
}
//表单校验规则
const rules = reactive({
    userName: [
        { validator: validateUser, trigger: 'blur' }
    ],
    passWord: [
        {  validator: validatePassword, trigger: 'blur' }
    ]
    
})



const formType = ref(0)
const imageUrl=new URL('../../../public/login-head.png',import.meta.url).href
//点击切换登录注册表单
const handleChange = () => {
    formType.value = !formType.value
}

//发送验证码
const countdownChange = () => {
    //如果点击点击了验证码，直接返回
    if(flag) {
        return
    }
    //判断手机号是否正确
    const reg = /^1[3456789]\d{9}$/
    if(!loginForm.userName||!reg.test(loginForm.userName)) {
        ElMessage.error('请输入正确的手机号')
        return
    }
    //如果点击了验证码，开始倒计时
    timer = setInterval(() => {
        if(countDown.time <= 0) {
            countDown.time = 60
            countDown.vaildText = '重新获取验证码'
            flag = false
            clearInterval(timer)//清除定时器
        }
        else{
            countDown.time--
            countDown.vaildText = `${countDown.time}秒后重新获取`
                   }
    }, 1000)
    flag = true
    //发送验证码
    getCode({tel:loginForm.userName}).then(({data})=>{
        if(data.code === 10000) {
            ElMessage.success('发送成功')
        }
    })

}

//表单提交
const submitForm = async (formEl) => {
    if (!formEl) return
    //手动校验表单
    await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      //注册
      if(formType.value) {
        userAuthentication(loginForm).then(({data})=>{
            if(data.code === 10000) {
                ElMessage.success('注册成功')
                formType.value = 0
            }
        })
      }
      //登录
      else {
        login(loginForm).then(({data})=>{
            if(data.code === 10000) {
                ElMessage.success('登录成功')
                console.log(data)
                //将token和用户信息存储到localStorage中
                localStorage.setItem('pz_token',data.data.token)
                localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
                //获取用户菜单权限
                menuPermissions().then(({data})=>{
                    store.commit('dynamicMenu',data.data)
                    //添加路由
                    toRaw(routerList.value).forEach(item => {
                        router.addRoute('main',item)
                    }) //跳转到首页
                    router.push('/')
                })
               
            }
        })
      }
    } 
    else {
      console.log('error submit!', fields)
    }
  })
}


</script>
<style lang="less" scoped>

:deep(.el-card__header) {
    padding: 0
}

.login-container {
    height: 100%;
    // background-image: url('../../assets/4bcd2607-1781-49ba-9788-eb98caf3ba64.jpg');
    // background-size: cover;
    // background-position: center;
    .card-header {
        background-color: #899fe1;

        img {
            width: 430px;
        }
    }

    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
}

</style>
