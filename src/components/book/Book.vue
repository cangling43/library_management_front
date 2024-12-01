<template>
    <div>
        <!-- 表单区域 -->
        <div class="UserForm">
            <el-input placeholder="请输入图书名称" v-model="params.name" clearable @clear="reset"></el-input>
            <el-input placeholder="请输入图书标准码" v-model="params.bookNo" clearable @clear="reset"></el-input>
            <el-button type="primary" @click="getUserInfo">
                <i class="el-icon-search"></i>
                搜索
            </el-button>
            <el-button type="warning" @click="reset">
                <i class="el-icon-refresh"></i>
                重置
            </el-button>
            <el-button type="primary" class="insertUser" @click="addDialogVisible = true">添加图书</el-button>
        </div>

        <el-table :data="tableData" stripe border row-key="id">
            <el-table-column prop="name" label="图书名称" width="95px"></el-table-column>
            <el-table-column prop="description" label="描述" width="280px"></el-table-column>
            <el-table-column prop="publishDate" label="出版日期"></el-table-column>
            <el-table-column prop="author" label="作者"></el-table-column>
            <el-table-column prop="publisher" label="出版社"></el-table-column>
            <el-table-column prop="category" label="分类"></el-table-column>
            <el-table-column prop="bookNo" label="标准码"></el-table-column>
            <el-table-column label="借书积分">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark">{{ scope.row.score }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="nums" label="数量">
                <template slot-scope="scope">
                    <el-tag type="warning" effect="dark">{{ scope.row.nums }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="cover" label="封面">
                <template slot-scope="scope">
                    <el-image :src="scope.row.cover" :preview-src-list="[scope.row.cover]"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
            <el-table-column prop="updatetime" label="更新时间"></el-table-column>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button class="btn" type="primary" icon="el-icon-edit" size="small"
                        @click="showEditDialog(scope.row.id)">编辑</el-button>
                    <el-button class="btn" type="danger" icon="el-icon-delete" size="small"
                        @click="removeUserById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin-top: 20px;">
            <el-pagination background :current-page="params.pageNum" :page-size="params.pageSize"
                :page-sizes="[3, 5, 8, 10]" layout="sizes,prev,pager,next,jumper" :total="total"
                @current-change="userChangePage" @size-change="userSizeChange"></el-pagination>
        </div>

        <!-- 添加图书的对话框 -->
        <el-dialog title="添加图书" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
            <!-- 内容主题区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="userAddForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="addForm.description" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="出版日期" prop="publishDate">
                    <el-date-picker value-format="yyyy-MM-dd" v-model="addForm.publishDate" type="date"
                        placeholder="请选择出版日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="addForm.author"></el-input>
                </el-form-item>
                <el-form-item label="出版社" prop="publisher">
                    <el-input v-model="addForm.publisher"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="category">
                    <el-cascader :props="{ value: 'name', label: 'name' }" v-model="addForm.categories"
                        :options="categories"></el-cascader>
                </el-form-item>
                <el-form-item label="标准码" prop="bookNo">
                    <el-input v-model="addForm.bookNo"></el-input>
                </el-form-item>
                <el-form-item label="借书积分" prop="score">
                    <el-input-number v-model="addForm.score" :min="10" :max="30" label="所需积分"></el-input-number>
                </el-form-item>
                <el-form-item label="数量" prop="nums">
                    <el-input v-model="addForm.nums"></el-input>
                </el-form-item>
                <el-form-item label="封面" prop="cover">
                    <el-input v-model="addForm.cover"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑图书 -->
        <el-dialog title="编辑图书" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px" class="userAddForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="editForm.description" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="出版日期" prop="publishDate">
                    <el-date-picker value-format="yyyy-MM-dd" v-model="editForm.publishDate" type="date"
                        placeholder="请选择出版日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="editForm.author"></el-input>
                </el-form-item>
                <el-form-item label="出版社" prop="publisher">
                    <el-input v-model="editForm.publisher"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="category">
                    <el-cascader :props="{ value: 'name', label: 'name' }" v-model="editForm.categories"
                        :options="categories"></el-cascader>
                </el-form-item>
                <el-form-item label="标准码" prop="bookNo">
                    <el-input v-model="editForm.bookNo" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="借书积分" prop="score">
                    <el-input-number v-model="editForm.score" :min="10" :max="30" label="所需积分"></el-input-number>
                </el-form-item>
                <el-form-item label="数量" prop="nums">
                    <el-input v-model="editForm.nums"></el-input>
                </el-form-item>
                <el-form-item label="封面" prop="cover">
                    <el-input v-model="editForm.cover"></el-input>
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
        this.getCategoryTree()
    },
    data() {
        return {
            admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
            tableData: [],
            total: 0,
            params: {
                name: '',
                bookNo: '',
                pageNum: 1,
                pageSize: 3
            },
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                name: '',
                description: '',
                publishDate: '',
                author: '',
                publisher: '',
                category: '',
                bookNo: '',
                score:10,
                cover: '',
                nums:"",
            },
            // 添加表单的验证规则对象
            addFormRules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入描述', trigger: 'blur' }
                ],
                publishDate: [
                    { required: true, message: '请输入出版日期', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: '请输入作者', trigger: 'blur' }
                ],
                publisher: [
                    { required: true, message: '请输入出版社', trigger: 'blur' }
                ],
                bookNo: [
                    { required: true, message: '请输入标准码', trigger: 'blur' }
                ],
                score: [
                    { required: true, message: '请输入借书积分', trigger: 'blur' }
                ],
                cover: [
                    { required: true, message: '请输入封面', trigger: 'blur' }
                ],
                nums: [
                    { required: true, message: '请输入数量', trigger: 'blur' },
                ],
            },
            editForm: {},
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            categories: [],
            // 添加修改表单的验证规则
            editFormRules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入描述', trigger: 'blur' }
                ],
                publishDate: [
                    { required: true, message: '请输入出版日期', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: '请输入作者', trigger: 'blur' }
                ],
                publisher: [
                    { required: true, message: '请输入出版社', trigger: 'blur' }
                ],
                bookNo: [
                    { required: true, message: '请输入标准码', trigger: 'blur' }
                ],
                score: [
                    { required: true, message: '请输入借书积分', trigger: 'blur' }
                ],
                nums: [
                    { required: true, message: '请输入封面', trigger: 'blur' }
                ],
                cover: [
                    { required: true, message: '请输入封面', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        async getUserInfo() {
            const { data: res } = await this.$http.get('book/page', { params: this.params })
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
                bookNo: '',
                pageNum: 1,
                pageSize: 3
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
                const { data: res } = await this.$http.post('book/save', this.addForm)
                if (res.code !== '200') {
                    return this.$message.error(res.msg)
                }
                this.$message.success('添加图书成功!')
                this.addDialogVisible = false
                this.getUserInfo()
                this.addDialogClosed()
            })
        },
        // 展示编辑用户的对话框
        async showEditDialog(id) {
            const { data: res } = await this.$http.get(`book/${id}`)
            if (res.code !== '200') {
                this.editDialogVisible = false
                return this.$message.error(res.msg)
            }
            this.editForm = res.data
            if (this.editForm.category) {
                this.editForm.categories=this.editForm.category.split('>')
            }
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
                const { data: res } = await this.$http.put('book/update', this.editForm)
                if (res.code !== '200') return this.$message.error(res.msg)
                this.editDialogClosed()
                this.editDialogVisible = false
                this.getUserInfo()
                this.$message.success('更新图书信息成功!')

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
            const { data: res } = await this.$http.delete('book/delete/' + id)
            if (res.code !== '200') {
                return this.$message.error('删除图书失败!')
            }
            this.$message.success('删除图书成功!')
            this.getUserInfo()
        },
        // 获取图书分类
        async getCategoryTree() {
            const { data: res } = await this.$http.get('category/tree')
            if (res.code !== '200') {
                this.$message.error('请求图书分类数据错误!')
            } else {
                this.categories = res.data
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
