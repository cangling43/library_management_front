<template>
    <div class="index">
        <!-- 跑马灯  -->
        <div>   
            <el-carousel height="600px">
                <el-carousel-item v-for="item in arrImg" :key="item">
                    <el-image :src="item" class="img"></el-image>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'index',
    data() {
        return {
            arrImg: [
                require("../assets/1.jpg"),
                require("../assets/2.jpg"),
                require("../assets/3.jpg"),
                require("../assets/4.jpg")
            ],
        }
    }
}
</script>


<style lang="less" scoped>
.img{
    height: 100%;
    width: 100%;
}

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>
