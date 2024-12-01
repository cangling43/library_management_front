<template>
    <div>
        <!-- 表单区域 -->
        <div class="UserForm">
            <el-input placeholder="请输入用户名" v-model="params.username" clearable @clear="reset"></el-input>
            <el-input placeholder="请输入联系方式" v-model="params.phone" clearable @clear="reset"></el-input>
            <el-input placeholder="请输入邮箱" v-model="params.email" clearable @clear="reset"></el-input>
            <el-button type="primary" @click="getUserInfo">
                <i class="el-icon-search"></i>
                搜索
            </el-button>
            <el-button type="warning" @click="reset">
                <i class="el-icon-refresh"></i>
                重置
            </el-button>
            <el-button type="primary" class="insertUser" @click="addDialogVisible = true">添加管理员</el-button>
        </div>

        <el-table :data="tableData" stripe border>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="phone" label="联系方式"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="240px"></el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
            <el-table-column prop="updatetime" label="更新时间"></el-table-column>
            <el-table-column label="状态(启用/禁用)">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"
                        @change="changeStatus(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="320px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small"
                        @click="showEditDialog(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small"
                        @click="removeUserById(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-key" size="small"
                        @click="handleChangePassword(scope.row)">修改密码</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin-top: 20px;">
            <el-pagination background :current-page="params.pageNum" :page-size="params.pageSize"
                :page-sizes="[2, 4, 6, 8]" layout="sizes,prev,pager,next,jumper" :total="total"
                @current-change="userChangePage" @size-change="userSizeChange"></el-pagination>
        </div>

        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
            <!-- 内容主题区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="userAddForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户的对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px" class="userAddForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改密码" :visible.sync="changeDialogVisible" width="25%">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
                <el-form-item label="新密码" prop="newPass">
                    <el-input v-model="form.newPass" show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="changePasswordDialogFormVisible">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
import Cookies from 'js-cookie';

export default ({
    created() {
        this.getUserInfo()
    },
    data() {
        var checkEmail = (rule, value, cb) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        var checkPhone = (rule, value, cb) => {
            const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regPhone.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的手机号'))
        }
        return {
            admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
            tableData: [],
            total: 0,
            params: {
                name: '',
                phone: '',
                pageNum: 1,
                pageSize: 2
            },
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: '',
                phone: '',
                email: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入地址', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
            },
            editForm: {},
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 添加修改表单的验证规则
            editFormRules: {
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入地址', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
            },
            form: {},
            changeDialogVisible: false,
            rules: {
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在3~10个字符之间', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        async getUserInfo() {
            const { data: res } = await this.$http.get('admin/page', { params: this.params })
            if (res.code !== '200') {
                this.$message.error('请求会员数据错误!')
            } else {
                this.tableData = res.data.list
                this.total = res.data.total
            }
        },
        reset() {
            this.params = {
                name: '',
                phone: '',
                pageNum: 1,
                pageSize: 2
            }
            this.getUserInfo()
        },
        userChangePage(pageNum) {
            this.params.pageNum = pageNum
            this.getUserInfo()
        },
        userSizeChange(pageSize) {
            this.params.pageSize = pageSize
            this.getUserInfo()
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请先完成填写')
                const { data: res } = await this.$http.post('admin/save', this.addForm)
                if (res.code !== '200') {
                    return this.$message.error(res.msg)
                }
                this.$message.success('添加用户成功!')
                this.addDialogVisible = false
                this.getUserInfo()
            })
        },
        // 展示编辑用户的对话框
        async showEditDialog(id) {
            const { data: res } = await this.$http.get(`admin/${id}`)
            if (res.code !== '200') {
                this.editDialogVisible = false
                return this.$message.error('查询用户信息失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 监听编辑用户表单的关闭
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息并提交
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请先完成填写')
                // 修改用户网络请求
                const { data: res } = await this.$http.put('admin/update', this.editForm)
                if (res.code !== '200') return this.$message.error('修改用户数据失败')
                this.editDialogVisible = false
                this.getUserInfo()
                this.$message.success('更新用户信息成功!')
            })
        },
        // 根据id删除对应的用户信息
        async removeUserById(id) {
            // 弹框是否确定删除
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => {
                return err
            })
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const { data: res } = await this.$http.delete('admin/delete/' + id)
            if (res.code !== '200') {
                return this.$message.error('删除用户失败!')
            }
            this.$message.success('删除用户成功!')
            this.getUserInfo()
        },
        // 修改密码
        handleChangePassword(row) {
            this.form = JSON.parse(JSON.stringify(row))
            this.changeDialogVisible = true
        },
        // 修改密码点击确定按钮
        changePasswordDialogFormVisible() {
            this.$refs.formRef.validate(async valid => {
                if (!valid) return this.$message.error('请先完成填写')
                const { data: res } = await this.$http.put('admin/password', this.form)

                if (res.code !== '200') {
                    return this.$message.error('修改密码失败!')
                }
                this.$message.success('修改密码成功!')

                // 修改的用户id为正在登陆的用户id
                if (this.form.id === this.admin.id) {
                    Cookies.remove('admin')
                    this.$router.push('login')
                } else {
                    this.getUserInfo()
                    this.changeDialogVisible = false
                }
            })
        },
        // 启用禁用状态
        async changeStatus(row) {
            if (this.admin.id == row.id && !row.status) {
                row.status=true
                this.$message.warning('不可禁用自身账号!')
                return
            }
            const { data: res } = await this.$http.put('admin/update', row)
            if (res.code !== '200') return this.$message.error('修改用户状态失败')
            this.getUserInfo()
            this.$message.success('更新用户状态成功!')
        }
    },
})
</script>

<style lang="less" scoped>
.UserForm {
    margin-bottom: 20px;
}

.el-input {
    width: 240px;
    margin-right: 2px;
}

.el-button {
    margin-left: 5px;
    margin-right: 5px;
}

.insertUser {
    position: absolute;
    right: 80px;
}

.userAddForm {
    margin-left: 20px;
}

.el-input {
    margin-right: 15px;
}
</style>
