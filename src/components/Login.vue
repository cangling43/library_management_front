<template>
    <div>
        <div id="login">
            <vue-particles class="login-bg" color="#39AFFD" :particleOpacity="0.7" :particlesNumber="100" shapeType="circle"
                :particleSize="4" linesColor="#8DD1FE" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4"
                :linesDistance="150" :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true"
                clickMode="push">
            </vue-particles>
        </div>
        <div class="login_container">
            <div class="login_box">

                <div class="avater_box">
                    <img src="../assets/头像.jpg" alt="" />
                </div>

                <el-form ref="loginFormRef" :model="loginForm" :rules="loginFromRules" label-width="0px" class="login_form">

                    <el-form-item prop="username">
                        <el-input placeholder="请输入用户名" v-model="loginForm.username"
                            prefix-icon="iconfont icon-user"></el-input>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input placeholder="请输入密码" show-password v-model="loginForm.password"
                            prefix-icon="iconfont icon-3702mima"></el-input>
                    </el-form-item>

                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="info" @click="resetLoginForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
  
<script>
import Cookies from 'js-cookie';
export default {
    data() {
        return {

            loginForm: {
                username: '',
                password: '',
            },

            loginFromRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在3~10个字符之间',
                        trigger: 'blur',
                    },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 15,
                        message: '长度在6~15个字符之间',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    methods: {
        // 给登录按钮绑定事件
        login() {
            this.$refs.loginFormRef.validate(async (valid) => {
                if (!valid) return this.$message.error('请填写用户名和密码!')
                const { data: res } = await this.$http.post('admin/login', this.loginForm)
                if (res.code != '200') return this.$message.error(res.msg)
                this.$message.success('登陆成功')
                if (res.data !== null) {
                    Cookies.set('admin', JSON.stringify(res.data))
                }
                this.$router.push('/home')
            })
        },
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields()
        },
    },
}
</script>
  
<style lang="less" scoped>

.login_box {
    width: 450px;
    height: 300px;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow:5px 5px 10px 5px #ccc;
    border-radius:25px;

    .avater_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.btns {
    display: flex;
    justify-content: flex-end;
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>
  