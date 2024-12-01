<template>
    <div>
        <!-- 表单区域 -->
        <div class="UserForm">
            <el-input placeholder="请输入分类名称" v-model="params.name" clearable @clear="reset"></el-input>
            <el-button type="primary" @click="getUserInfo">
                <i class="el-icon-search"></i>
                搜索
            </el-button>
            <el-button type="warning" @click="reset">
                <i class="el-icon-refresh"></i>
                重置
            </el-button>
            <el-button type="primary" class="insertUser" @click="addDialogVisible = true">添加分类</el-button>
        </div>

        <el-table :data="tableData" stripe border row-key="id">
            <el-table-column width="50px"></el-table-column>
            <el-table-column prop="name" label="分类"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
            <el-table-column prop="updatetime" label="更新时间"></el-table-column>
            <el-table-column label="操作" width="320px">
                <template slot-scope="scope">
                    <el-button type="success" icon="el-icon-thumb" size="small" @click="handleAdd(scope.row)"
                        v-if="!scope.row.pid">添加</el-button>
                    <el-button type="primary" icon="el-icon-edit" size="small"
                        @click="showEditDialog(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small"
                        @click="removeUserById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin-top: 20px;">
            <el-pagination background :current-page="params.pageNum" :page-size="params.pageSize"
                :page-sizes="[8, 10, 15, 20]" layout="sizes,prev,pager,next,jumper" :total="total"
                @current-change="userChangePage" @size-change="userSizeChange"></el-pagination>
        </div>

        <!-- 添加一级分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
            <!-- 内容主题区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="userAddForm">
                <el-form-item label="分类" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加二级分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addSecondDialogVisible" width="30%" @close="editDialogClosed">
            <!-- 内容主题区 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px" class="userAddForm">
                <el-form-item label="分类" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="editForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addSecondDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="AddSecondDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑分类 -->
        <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px" class="userAddForm">
                <el-form-item label="分类" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="editForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
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
        return {
            pid: null,
            admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
            tableData: [],
            total: 0,
            params: {
                name: '',
                pageNum: 1,
                pageSize: 8
            },
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                name: '',
                remark: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
            },
            editForm: {},
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 添加修改表单的验证规则
            editFormRules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
            },
            addSecondDialogVisible: false,
            addSecondForm: {},
        }
    },
    methods: {
        async getUserInfo() {
            const { data: res } = await this.$http.get('category/page', { params: this.params })
            if (res.code !== '200') {
                this.$message.error('请求图书数据错误!')
            } else {
                this.tableData = res.data.list
                this.total = res.data.total
            }
        },
        reset() {
            this.params = {
                name: '',
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
        async addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请先完成填写')
                const { data: res } = await this.$http.post('category/save', this.addForm)
                if (res.code !== '200') {
                    return this.$message.error(res.msg)
                }
                this.$message.success('添加分类成功!')
                this.addDialogVisible = false
                this.getUserInfo()
                this.addDialogClosed()
            })
        },
        // 展示编辑用户的对话框
        async showEditDialog(id) {
            const { data: res } = await this.$http.get(`category/${id}`)
            if (res.code !== '200') {
                this.editDialogVisible = false
                return this.$message.error(res.msg)
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
                const { data: res } = await this.$http.put('category/update', this.editForm)
                if (res.code !== '200') return this.$message.error(res.msg)
                this.editDialogClosed()
                this.editDialogVisible = false
                this.getUserInfo()
                this.$message.success('更新分类信息成功!')

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
            const { data: res } = await this.$http.delete('category/delete/' + id)
            if (res.code !== '200') {
                return this.$message.error('删除分类失败!')
            }
            this.$message.success('删除分类成功!')
            this.getUserInfo()
        },
        handleAdd(row) {
            this.editForm = {},
                this.pid = row.id
            this.addSecondDialogVisible = true
        },
        // 添加二级表单
        async AddSecondDialog() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请先完成填写')
                this.editForm.pid = this.pid
                // 修改用户网络请求
                const { data: res } = await this.$http.post('category/save', this.editForm)
                if (res.code !== '200') return this.$message.error(res.msg)
                this.addSecondDialogVisible = false
                this.$message.success('新增二级分类信息成功!')
                this.getUserInfo()
                this.editDialogClosed()
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
