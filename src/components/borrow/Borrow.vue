<template>
    <div>
        <!-- 表单区域 -->
        <div class="UserForm">
            <el-input placeholder="请输入图书名称" v-model="params.name" clearable @clear="reset"></el-input>
            <el-input placeholder="请输入图书标准码" v-model="params.bookNo" clearable @clear="reset"></el-input>
            <el-input placeholder="请输入用户名称" v-model="params.userName" clearable @clear="reset"></el-input>
            <el-button type="primary" @click="getUserInfo">
                <i class="el-icon-search"></i>
                搜索
            </el-button>
            <el-button type="warning" @click="reset">
                <i class="el-icon-refresh"></i>
                重置
            </el-button>
            <el-button type="primary" class="insertUser" @click="addDialogVisible = true">借书添加</el-button>
        </div>

        <el-table :data="tableData" stripe border row-key="id">
            <el-table-column prop="bookName" label="图书名称" width="120px"></el-table-column>
            <el-table-column prop="bookNo" label="图书标准码" width="180px"></el-table-column>
            <el-table-column prop="userNo" label="用户会员码"></el-table-column>
            <el-table-column prop="userName" label="用户名称" width="80px"></el-table-column>
            <el-table-column prop="userPhone" label="用户联系方式"></el-table-column>
            <el-table-column prop="score" label="所用积分" width="60px">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark">{{ scope.row.score }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button class="btn" type="danger" icon="el-icon-delete" size="small"
                        @click="removeUserById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin-top: 20px;">
            <el-pagination background :current-page="params.pageNum" :page-size="params.pageSize" :page-sizes="[7, 10, 15, 20]"
                layout="sizes,prev,pager,next,jumper" :total="total" @current-change="userChangePage"
                @size-change="userSizeChange"></el-pagination>
        </div>

        <!-- 添加图书的对话框 -->
        <el-dialog title="添加借书记录" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
            <!-- 内容主题区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="userAddForm">
                <el-form-item label="标准码" prop="bookNo">
                    <el-select v-model="addForm.bookNo" filterable placeholder="请选择" @change="selBook">
                        <el-option v-for="item in books" :key="item.id" :label="item.bookNo" :value="item.bookNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图书名称" prop="bookName">
                    <el-input v-model="addForm.bookName" disabled></el-input>
                </el-form-item>
                <el-form-item label="图书数量" prop="nums">
                    <el-input v-model="addForm.nums" disabled></el-input>
                </el-form-item>
                <el-form-item label="所需积分" prop="score">
                    <el-input v-model="addForm.score" disabled></el-input>
                </el-form-item>
                <el-form-item label="会员码" prop="userNo">
                    <el-select v-model="addForm.userNo" filterable placeholder="请选择" @change="selUser">
                        <el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.username">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="addForm.userName" disabled></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="userPhone">
                    <el-input v-model="addForm.userPhone" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户积分" prop="account">
                    <el-input v-model="addForm.account" disabled></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import Cookies from 'js-cookie';

export default ({
    created() {
        this.getUserInfo()
        this.getCategoryTree()
        this.getUsers()
    },
    data() {
        return {
            admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
            tableData: [],
            total: 0,
            params: {
                name: '',
                userName: '',
                bookNo: '',
                pageNum: 1,
                pageSize: 7
            },
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                userPhone: '',
                bookNo: '',
                bookName: '',
                nums: "",
            },
            // 添加表单的验证规则对象
            addFormRules: {
                bookNo: [
                    { required: true, message: '请选择标准码', trigger: 'blur' }
                ],
                bookName: [
                    { required: true, message: '请选择书名', trigger: 'blur' }
                ],
                score: [
                    { required: true, message: '所需积分', trigger: 'blur' }
                ],
                userNo: [
                    { required: true, message: '请选择会员码', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '用户名称', trigger: 'blur' }
                ],
                nums: [
                    { required: true, message: '图书数量', trigger: 'blur' }
                ],
                userPhone: [
                    { required: true, message: '联系方式', trigger: 'blur' }
                ],
                account: [
                    { required: true, message: '用户积分', trigger: 'blur' }
                ],
            },
            books: [],
            users: [],
        }
    },
    methods: {
        async getUserInfo() {
            const { data: res } = await this.$http.get('borrow/page', { params: this.params })
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
                userName: '',
                bookNo: '',
                pageNum: 1,
                pageSize: 7
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
                const { data: res } = await this.$http.post('borrow/save', this.addForm)
                if (res.code !== '200') {
                    return this.$message.error(res.msg)
                }
                this.$message.success('添加图书成功!')
                this.addDialogVisible = false
                this.getUserInfo()
                this.addDialogClosed()
            })
        },
        // 根据id删除对应的用户信息
        async removeUserById(id) {
            // 弹框是否确定删除
            const confirmResult = await this.$confirm('此操作将永久删除该借书数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => {
                return err
            })
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const { data: res } = await this.$http.delete('borrow/delete/' + id)
            if (res.code !== '200') {
                return this.$message.error('删除借书数据失败!')
            }
            this.$message.success('删除借书数据成功!')
            this.getUserInfo()
        },

        async getCategoryTree() {
            const { data: res } = await this.$http.get('book/list')
            if (res.code !== '200') {
                this.$message.error('请求数据错误!')
            } else {
                this.books = res.data
            }
        },
        async getUsers() {
            const { data: res } = await this.$http.get('user/list')
            if (res.code !== '200') {
                this.$message.error('请求数据错误!')
            } else {
                this.users = res.data
            }
        },
        async selBook() {
            const book = this.books.find(v => v.bookNo === this.addForm.bookNo)
            const { data: res } = await this.$http.get('book/' + book.id)
            if (res.code !== '200') {
                this.$message.error('请求数据错误!')
            } else {
                this.addForm.bookName = res.data.name
                this.addForm.score = res.data.score
                this.addForm.nums = res.data.nums
            }


        },
        async selUser() {
            const user = this.users.find(v => v.username === this.addForm.userNo)
            const { data: res } = await this.$http.get('user/' + user.id)
            if (res.code !== '200') {
                this.$message.error('请求数据错误!')
            } else {
                this.addForm.userName = res.data.name
                this.addForm.userPhone = res.data.phone
                this.addForm.account = res.data.account
            }
            
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
