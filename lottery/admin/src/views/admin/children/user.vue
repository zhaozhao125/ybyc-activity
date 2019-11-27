<template>
  <div class="user-admin">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- <el-button type="primary" size="small" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button> -->
        <el-input size="small" v-model="lotteryCode" placeholder="请输入活动编码" style="width:auto">
          <el-button slot="append" type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-input>
      </div>
      <div class="table-container">
        <el-table :data="tableData" border style="width: 100%" v-loading="tableLoading">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="lotteryCode" label="抽奖活动代码">
          </el-table-column>
          <el-table-column prop="name" label="姓名">
          </el-table-column>
          <el-table-column prop="phone" label="手机号">
          </el-table-column>
          <el-table-column prop="type" label="公司类别">
            <template slot-scope="scope">
              {{scope.row.type | typeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="company" label="公司">
          </el-table-column>
          <el-table-column prop="job" label="职位">
          </el-table-column>
          <el-table-column label="创建时间" min-width="220">
            <template slot-scope="scope">
              {{formatDate(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteUser(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-container">
        <el-pagination :current-page="page" background layout="prev, pager, next" :total="pageTotal" :page-size='20' @current-change="handlePageChange">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import util from '@/util/'
export default {

  name: 'userAdmin',

  data() {
    return {
      tableData: [],
      tableLoading: true,
      page: 1,
      pageTotal: 0,
      lotteryCode: ''
    }
  },
  created() {
    this.lotteryCode = this.$route.query.lotteryCode
    this.loadTableData()
  },

  filters: {
    typeFilter(type) {
      switch (type) {
        case 1:
          return '一步用车'
        case 2:
          return '四海盛景'
        case 3:
          return '四海鑫河'
        case 4:
          return '晋商会'
        case 5:
          return '特邀嘉宾'
      }
    }
  },

  methods: {
    loadTableData() {
      this.tableLoading = true
      this.$service.findUser(this.page, this.lotteryCode).then(res => {
        this.tableLoading = false
        let result = res.data
        if (result.success) {
          this.tableData = result.data.docs
          this.pageTotal = result.data.total
        }
      }).catch(err => {
        this.tableLoading = false
      })
    },
    handleRefresh(){
      this.page = 1
      this.loadTableData()
    },
    handleSearch(){
      this.page = 1
      this.loadTableData()
    },
    handlePageChange(currentPage) {
      this.page = currentPage
      this.loadTableData()
    },
    formatDate(date) {
      return util.formatDate(date)
    },
    deleteUser(index) {
      this.$confirm('是否删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        let userId = this.tableData[index]._id
        this.$service.deleteUser(userId).then(res => {
          this.tableLoading = false
          let result = res.data
          if (result.success) {
            this.tableData.splice(index, 1)
          }
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(err => {
          this.tableLoading = false
        })
      }).catch(() => {

      })
    }
  }
};

</script>
<style lang="css" scoped>


</style>
