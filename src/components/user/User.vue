<template>
    <div>
        <!-- 表单区域 -->
        <div class="UserForm">
            <el-input placeholder="请输入姓名" v-model="params.name" clearable @clear="reset"></el-input>
            <el-input placeholder="请输入联系方式" v-model="params.phone" clearable @clear="reset"></el-input>
            <el-button type="primary" @click="getUserInfo">
                <i class="el-icon-search"></i>
                搜索
            </el-button>
            <el-button type="warning" @click="reset">
                <i class="el-icon-refresh"></i>
                重置
            </el-button>
            <el-button type="primary" class="insertUser" @click="addDialogVisible = true">添加用户</el-button>
        </div>

        <el-table :data="tableData" stripe border>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="age" label="年龄"></el-table-column>
            <el-table-column prop="address" label="地址" width="200px"></el-table-column>
            <el-table-column prop="phone" label="联系方式"></el-table-column>
            <el-table-column prop="account" label="账户积分" width="100px">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark">{{ scope.row.account }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
            <el-table-column prop="updatetime" label="更新时间"></el-table-column>
            <el-table-column label="性别" width="70px">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.sex === '男'" type="primary">{{ scope.row.sex }}</el-tag>
                    <el-tag v-if="scope.row.sex === '女'" type="success">{{ scope.row.sex }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small"
                        @click="showEditDialog(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small"
                        @click="removeUserById(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-shopping-cart-1" size="small"
                        @click="handleAccountAdd(scope.row)">充值</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin-top: 20px;">
            <el-pagination background :current-page="params.pageNum" :page-size="params.pageSize"
                :page-sizes="[8, 10, 15, 20]" layout="sizes,prev,pager,next,jumper" :total="total"
                @current-change="userChangePage" @size-change="userSizeChange"></el-pagination>
        </div>

        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
            <!-- 内容主题区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="userAddForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="addForm.age"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio v-model="addForm.sex" label="男">男</el-radio>
                    <el-radio v-model="addForm.sex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="addForm.address"></el-input>
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
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="editForm.age"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-input v-model="editForm.sex" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="editForm.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 充值的对话框 -->
        <el-dialog title="充值" :visible.sync="chongDialogVisible" width="30%" @close="editDialogClosed">
            <el-form :model="chongForm" :rules="chongFormRules" ref="chongFormRef" label-width="80px" class="userAddForm">
                <el-form-item label="当前账户积分" prop="account">
                    <el-input disabled v-model="chongForm.account"></el-input>
                </el-form-item>
                <el-form-item label="积分" prop="score">
                    <el-input v-model="chongForm.score"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="chongDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAccount">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>

export default ({
    created() {
        this.getUserInfo()
    },
    data() {
        var checkSex = (rule, value, cb) => {
            const regSex = /^(男|女)$/;
            if (regSex.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的性别'))
        }
        var checkPhone = (rule, value, cb) => {
            const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regPhone.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的手机号'))
        }
        return {
            tableData: [],
            total: 0,
            params: {
                name: '',
                phone: '',
                pageNum: 1,
                pageSize: 8
            },
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                name: '',
                age: '',
                sex: '男',
                phone: '',
                address: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                age: [
                    { required: true, message: '请输入年龄', trigger: 'blur' },
                ],
                sex: [
                    { required: true, message: '请输入性别', trigger: 'blur' },
                    { validator: checkSex, trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入地址', trigger: 'blur' }
                ],
            },
            editForm: {},
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 添加修改表单的验证规则
            editFormRules: {
                age: [
                    { required: true, message: '请输入年龄', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入地址', trigger: 'blur' }
                ],
            },
            chongDialogVisible: false,
            chongForm: {},
            chongFormRules: {
                score: [
                    { required: true, message: '请输入充值金额', trigger: 'blur' },
                ],
            }
        }
    },
    methods: {
        async getUserInfo() {
            const { data: res } = await this.$http.get('user/page', { params: this.params })
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
                pageSize: 8
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
                const { data: res } = await this.$http.post('user/save', this.addForm)
                if (res.code !== '200') {
                    return this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                this.addDialogVisible = false
                this.getUserInfo()
            })
        },
        // 展示编辑用户的对话框
        async showEditDialog(id) {
            const { data: res } = await this.$http.get(`user/${id}`)
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
                const { data: res } = await this.$http.put('user/update', this.editForm)
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
            console.log(id)
            const { data: res } = await this.$http.delete('user/delete/' + id)
            if (res.code !== '200') {
                return this.$message.error('删除用户失败!')
            }
            this.$message.success('删除用户成功!')
            this.getUserInfo()
        },
        handleAccountAdd(row) {
            this.chongForm=JSON.parse(JSON.stringify(row))
            this.chongDialogVisible=true
        },
        addAccount() {
            this.$refs.chongFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请先完成填写')
                // 修改用户网络请求
                const { data: res } = await this.$http.post('user/account', this.chongForm)
                if (res.code !== '200') return this.$message.error('充值失败,请联系管理员!')
                this.chongDialogVisible = false
                this.getUserInfo()
                this.$message.success('充值成功!')
            })
        },
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
