<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/图书馆.png" alt="">
                <span>图书管理系统</span>
            </div>
            <el-dropdown>
                <el-button type="primary" size="middle">
                    {{ admin.username }}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <div style="width: 50px;text-align: center;" @click="logout">退出</div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>

        <el-container>
            <el-aside :width="isCollapse ? '20px' : '202px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>

                <el-menu background-color="#fff" text-color="black" active-text-color="#409EFF" :unique-opened="true"
                    :collapse="isCollapse" :collapse-transition="false" router :default-active="$route.path">

                    <el-menu-item index="/homePage">
                        <i class="el-icon-s-management"></i>
                        <span>首页</span>
                    </el-menu-item>

                    <el-submenu index="user">
                        <template slot="title">
                            <i class="el-icon-user-solid"></i>
                            <span>会员管理</span>
                        </template>
                        <el-menu-item index="/user">
                            <i class="el-icon-user"></i>
                            <span>会员列表</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="admin">
                        <template slot="title">
                            <i class="el-icon-s-tools"></i>
                            <span>管理员管理</span>
                        </template>
                        <el-menu-item index="/admin">
                            <i class="el-icon-setting"></i>
                            <span>管理员列表</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="category">
                        <template slot="title">
                            <i class="el-icon-s-unfold"></i>
                            <span>图书分类管理</span>
                        </template>
                        <el-menu-item index="/category">
                            <i class="el-icon-collection"></i>
                            <span>图书分类</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="book">
                        <template slot="title">
                            <i class="el-icon-s-order"></i>
                            <span>图书管理</span>
                        </template>
                        <el-menu-item index="/book">
                            <i class="el-icon-collection"></i>
                            <span>图书列表</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="borrow">
                        <template slot="title">
                            <i class="el-icon-s-operation"></i>
                            <span>借书管理</span>
                        </template>
                        <el-menu-item index="/borrow">
                            <i class="el-icon-collection-tag"></i>
                            <span>借书列表</span>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Cookies from 'js-cookie'
export default ({
    data() {
        return {
            isCollapse: false,
            admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {}
        }
    },

    methods: {
        logout() {
            Cookies.remove('admin')
            // window.sessionStorage.clear()
            this.$message.success('退出成功')
            this.$router.push('/login')
        },
        // 点击按钮切换菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
    },

})
</script>


<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-header {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: black;
    font-size: 20px;
    border-bottom: 1px solid gray;

    >div {
        display: flex;
        align-items: center;

        img {
            width: 50px;
            height: 50px;
            margin-left: 20px;
        }

        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #fff;
    border-right: 1px solid gray;

    .el-menu {
        border-right: none;
    }
}

.el-main {
    background-color: #fff;
}

.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

.el-menu span {
    font-weight: bold;
    font-size: 17px;
}
</style>