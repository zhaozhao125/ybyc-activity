<template>
  <div class="lottery-admin">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="dialogVisible = true">新增抽奖活动</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
      </div>
      <div class="content">
        <el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div class="lottery-detail">
                <p>活动内容：{{scope.row.content}}</p>
                <ul v-if="scope.row.prizes && scope.row.prizes.length">
                  <li v-for="(item, index) in scope.row.prizes" :key="index">
                    <div class="table-prize">
                      <h3>{{chineseNumber[item.level]}}等奖</h3>
                      <p>奖品名：{{item.prizeTitle}}</p>
                      <p>奖品内容：{{item.prizeContent}}</p>
                      <p>奖品数量：{{item.number}}</p>
                      <p>奖品图片：
                        <img v-for="(img, imgIndex) in item.imgurl" :key="imgIndex" :src="getImgUrl(img)" alt="">
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="活动名称" prop="title">
          </el-table-column>
          <el-table-column label="活动内容：" prop="content">
          </el-table-column>
          <el-table-column label="活动代码" prop="code">
          </el-table-column>
          <el-table-column label="奖品等级" prop="level" width="100">
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="240">
            <template slot-scope="scope">
              {{formatDate(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state == 0">未开始</el-tag>
              <el-tag v-if="scope.row.state == 1" type="success">已开始</el-tag>
              <el-tag v-if="scope.row.state == 2" type="gray">已停止</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="540">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.state != 1" @click="startLottery(scope.$index)">开始</el-button>
              <el-button type="text" v-if="scope.row.state == 1" @click="stopLottery(scope.$index)">停止</el-button>
              <el-button type="text" @click="clearLotteryWinner(scope.$index)">重置</el-button>
              <el-button type="text" @click="showLotteryWinner(scope.$index)">查看结果</el-button>
              <el-button type="text" @click="deleteLottery(scope.$index)">删除</el-button>
              <el-button type="text" @click="showUser(scope.$index)">查看用户</el-button>
              <el-button type="text" @click="addFakeUser(scope.$index)">添加模拟用户</el-button>
              <el-button type="text" @click="clearUser(scope.$index)">清空用户</el-button>
              <el-button type="text" :disabled="scope.row.state!=1" @click="$router.push({name: 'startLottery', query: {lotteryCode: scope.row.code}})">开始抽奖</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="新增抽奖活动" :visible.sync="dialogVisible" width="800px">
      <el-form ref="formModel" :model="formModel" label-width="100px">
        <el-form-item label="活动名称" prop="title" :rules="requiredRule">
          <el-input v-model="formModel.title"></el-input>
        </el-form-item>
        <el-form-item label="活动内容">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="formModel.content"></el-input>
        </el-form-item>
        <el-form-item label="活动编号" prop="code" :rules="requiredRule">
          <el-input v-model="formModel.code"></el-input>
        </el-form-item>
        <el-form-item label="奖品等级">
          <el-input-number v-model="formModel.level" :min="1" :max="10" @change="handleLevelChange"></el-input-number>
        </el-form-item>
        <el-form-item label="开启特等奖">
          <el-switch v-model="hasSuperPrize" active-color="#13ce66" inactive-color="#aaa">
          </el-switch>
        </el-form-item>
        <div class="prize-container" v-if="formModel.prizes.length">
          <el-card class="prize" v-if="hasSuperPrize">
            <h3>特等奖</h3>
            <el-form-item label="奖品名称" prop="prizeTitle">
              <el-input v-model="superPrize.prizeTitle"></el-input>
            </el-form-item>
            <el-form-item label="奖品内容说明">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="superPrize.prizeContent"></el-input>
            </el-form-item>
            <el-form-item label="奖品图片">
              <el-upload :action="uploadUrl" ref="uploaderSuper" list-type="picture" name="img">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="奖品数量">
              <el-input-number v-model="superPrize.number" :min="1"></el-input-number>
            </el-form-item>
          </el-card>
          <el-card class="prize" v-for="(item, index) in formModel.prizes" :key="index">
            <h3>{{chineseNumber[index + 1]}}等奖</h3>
            <el-form-item label="奖品名称" prop="prizeTitle">
              <el-input v-model="item.prizeTitle"></el-input>
            </el-form-item>
            <el-form-item label="奖品内容说明">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="item.prizeContent"></el-input>
            </el-form-item>
            <el-form-item label="奖品图片">
              <el-upload :action="uploadUrl" ref="uploader" list-type="picture" name="img">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="奖品数量">
              <el-input-number v-model="item.number" :min="1"></el-input-number>
            </el-form-item>
          </el-card>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createLottery">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看中奖结果" :visible.sync="winnerVisible" width="500px">
      <div class="final-winners" v-if="currentLottery">
        <div class="winner-container" v-for="(item, index) in currentLottery.prizes" :key="index">
          <h4>{{chineseNumber[item.level]}}等奖：{{item.prizeTitle}}</h4>
          <ul>
            <li v-for="(winner, winnerIndex) in item.winners" :key="winnerIndex">{{winner.phone + '\t'}} {{winner.name}} {{companyMap(winner.type)}}</li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="winnerVisible=false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { UPLOAD_URL } from '@/config/base-url.js'
import dataService from '@/service/'
import fileService from '@/service/fileService'
import util from '@/util/'
import sendFakeUser from '@/util/test.js'

export default {

  name: 'lotteryAdmin',

  data() {
    return {
      dialogVisible: false,
      chineseNumber: [
        '特',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十'
      ],
      formModel: {
        title: '',
        content: '',
        code: '',
        level: 3,
        prizes: []
      },
      oldLevel: 3,
      uploadUrl: UPLOAD_URL,
      requiredRule: [{
        required: true,
        message: '此项为必填项',
        trigger: 'blur'
      }],
      tableData: [],
      winnerVisible: false,
      currentLottery: null,
      tableLoading: true,
      hasSuperPrize: false,
      superPrize: {
        prizeTitle: '',
        prizeContent: '',
        imgurl: [],
        number: 1
      }
    }
  },
  created() {
    for (let i = this.oldLevel; i > 0; i--) {
      this.addPrize()
    }
    this.loadTableData()
  },
  methods: {
    loadTableData(){
      this.tableLoading = true
      dataService.findAllLottery().then(res => {
        this.tableLoading = false
        let result = res.data
        if (result.success) {
          this.tableData = result.data
        }
      }).catch(err => {
        this.tableLoading = false
      })
    },
    handleRefresh(){
      this.loadTableData()
    },
    companyMap(type){
      if(type == 1){
        return '一步用车'
      }
      if(type == 2){
        return '四海盛景'
      }
      if(type == 3){
        return '四海鑫河'
      }
      if(type == 4){
        return '晋商会'
      }
      if(type == 5){
        return '特邀嘉宾'
      }
    },
    getImgUrl(img) {
      return fileService.getImgUrl(img)
    },
    formatDate(date) {
      return util.formatDate(date)
    },
    addPrize() {
      this.formModel.prizes.push({
        prizeTitle: '',
        prizeContent: '',
        imgurl: [],
        number: 1
      })
    },
    changePrizes() {
      let difference = this.formModel.level - this.oldLevel
      if (difference > 0) {
        for (let i = difference; i > 0; i--) {
          this.addPrize()
        }
      } else if (difference < 0) {
        this.formModel.prizes.splice(this.formModel.level, -difference)
      }
      console.log('====this.formModel.prizes====', this.formModel.prizes)
      this.oldLevel = this.formModel.level
    },
    handleLevelChange() {
      setTimeout(() => {
        this.changePrizes()
      }, 10)
    },
    clearForm() {
      this.formModel = {
        title: '',
        content: '',
        level: 1,
        prizes: []
      }
      this.oldLevel = 1
      this.hasSuperPrize = false
      this.$refs.uploader.forEach((item, index) => {
        item.clearFiles()
      })
      this.addPrize()
    },
    createLottery() {
      this.$refs.uploader.forEach((item, index) => {
        if (item.uploadFiles) {
          this.formModel.prizes[index].imgurl = item.uploadFiles.map(file => file.response.filename)
        }
      })
      this.formModel.prizes.forEach((item, index) => {
        item.level = index + 1
      })
      let data = Object.assign({}, this.formModel)
      if(this.hasSuperPrize){
        this.superPrize.level = 0
        this.superPrize.imgurl = this.$refs.uploaderSuper.uploadFiles.map(item => item.response.filename)
        data.prizes.unshift(this.superPrize)
      }
      console.log('====data====', data)
      this.tableLoading = true
      dataService.addLottery(JSON.stringify(data)).then(res => {
        this.tableLoading = false
        console.log('====res====', res)
        let result = res.data
        if (result.success) {
          this.tableData.unshift(result.data)
          this.dialogVisible = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.clearForm()
        }
      }).catch(err => {
        console.log('====err====', err)
        this.tableLoading = false
        this.$message({
          message: err.data.msg||'添加请求失败',
          type: 'error'
        })
      })
    },
    startLottery(index) {
      // if (this.tableData.some(item => item.state == 1)) {
      //   this.$message({
      //     message: '同时只能激活一个活动',
      //     type: 'warning'
      //   })
      //   return
      // }
      let id = this.tableData[index]._id
      this.tableLoading = true
      dataService.startLottery(id).then(res => {
        this.tableLoading = false
        console.log('========', res)
        let result = res.data
        if (result.success) {
          this.tableData[index].state = 1
        }
      }).catch(err => {
        this.tableLoading = false
      })
    },
    stopLottery(index) {
      let id = this.tableData[index]._id
      this.tableLoading = true
      dataService.stopLottery(id).then(res => {
        this.tableLoading = false
        console.log('========', res)
        let result = res.data
        if (result.success) {
          this.tableData[index].state = 2
        }
      }).catch(err => {
        this.tableLoading = false
      })
    },
    deleteLottery(index) {
      console.log('====delete====', index)
      this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = this.tableData[index]._id
        dataService.deleteLottery(id).then(res => {
          console.log('====res====', res)
          if (res.data.success) {
            this.tableData.splice(index, 1)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '删除失败',
              type: 'warning'
            })
          }
        }).catch(err => {
          this.$message({
            message: '删除请求失败',
            type: 'error'
          })
        })
      }).catch(() => {

      })
    },
    showUser(index){
      this.$router.push({
        name: 'user',
        query: {
          lotteryCode: this.tableData[index].code
        }
      })
      console.log('====this====', this)
      this.$parent.$refs.nav.activeIndex = '/admin/user'
    },
    addFakeUser(index){
      this.$prompt('请输入添加的用户数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: (val)=>{
            if(isNaN(val) || parseInt(val) <= 0 || !val){
              return '请输入大于0的整数'
            }
            return true
          }
        }).then(({ value }) => {
          this.tableLoading = true
          sendFakeUser(value, this.tableData[index].code, () => {
            this.tableLoading = false
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          })
        })
    },
    clearUser(index){
      this.$confirm('此操作将永久删除该项目的用户数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dataService.deleteUserOfLottery(this.tableData[index].code).then(res => {
          this.$message({
            message: '已删除',
            type: 'success'
          })
        })
      }).catch(() => {

      })
    },
    clearLotteryWinner(index) {
      this.$confirm('此操作将永久重置获奖数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = this.tableData[index]._id
        this.tableLoading = true
        dataService.clearLotteryWinner(id).then(res => {
          this.tableLoading = false
          console.log('====res====', res)
          if (res.data.success) {
            this.$message({
              message: '已重置获奖数据',
              type: 'success'
            })
          } else {
            this.$message({
              message: '重置失败',
              type: 'warning'
            })
          }
        }).catch(err => {
          this.tableLoading = false
          this.$message({
            message: '重置请求失败',
            type: 'error'
          })
        })
      }).catch(() => {

      })
    },
    showLotteryWinner(index) {
      this.tableLoading = true
      this.$service.findAllLottery({
        code: this.tableData[index].code
      }).then(res => {
        let data = res.data.data[0]
        if(data){
          this.currentLottery = data
          this.winnerVisible = true
        }else{
          this.$message({
            message: '找不到该活动',
            type: 'error'
          })
        }
        this.tableLoading = false
      }).catch(()=>{
        this.loadTableData = false
      })
    }
  }
};

</script>
<style lang="scss">
.lottery-admin {
  .prize-container {
    .prize {
      margin: 10px;
      h3 {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  .lottery-detail {
    max-height: 500px;
    overflow: auto;
    li {
      margin-bottom: 30px;
    }
    img {
      max-width: 50%;
      display: block;
    }
  }

  .final-winners {
    ul {
      list-style: none;
      padding-left: 20px;
    }
  }
  .winner-container{
    ul{
      font-family: monospace;
    }
  }
}
</style>
