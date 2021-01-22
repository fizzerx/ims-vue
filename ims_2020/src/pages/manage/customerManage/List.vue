<template>
  <div class="warp">
    <el-tabs v-model="activeName">
      <el-tab-pane label="我的客群" name="first"></el-tab-pane>
    </el-tabs>
    <div style="width:98%;margin: 20px 0 0 1%;">
      <div class="btnBox">
        <el-button type="primary" plain size="medium" @click="uploadingGroupClick">上传客群</el-button>
        <el-button type="primary" plain size="medium" @click="mergeGroupClick">客群并交</el-button>
        <el-input placeholder="客群搜索"
             v-model="inputSearch"
            @input="searchGroupByName"
            @keyup.native.enter="searchGroupByName"
             class="inputSearch">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="searchGroupByName"></i>
        </el-input>
      </div>
      <el-table
        :data="tableData"
        stripe
        style="border: 1px solid #e4e6ec;border-bottom: none;"
        ref="custable"
      >
        <template v-for="(item,index) in tableConfig">
          <el-table-column
            v-if="item.operations"
            :key="index"
            :label="item.label"
            :width="item.width"
            :formatter="item.formatter"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="useGroup(scope.$index, tableData)" icon="el-icon-sell">应用</el-button>
              <el-button type="text" size="small" @click="groupAnalysis(scope.$index, tableData)" icon="el-icon-edit-outline">分析</el-button>
              <el-button type="text" size="small" @click="updateGroupInfo(scope.$index, tableData)" icon="el-icon-edit">修改</el-button>
              <el-button type="text" size="small" @click="deletGroup(scope.$index, tableData)" icon="el-icon-delete">删除</el-button>
              <el-button type="text" size="small" @click="updateGroup(scope.row)"><i class="el-icon-refresh-right" v-if="!scope.row.updateIcon"></i><i v-else class="el-icon-loading"></i>更新</el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :label="item.label"
            :prop="item.prop"
            :key="index"
            :width="item.width"
            :formatter="item.formatter"
            show-overflow-tooltip
          ></el-table-column>
        </template>
      </el-table>
      <div class="block" style="margin-top:10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNow"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total,sizes, prev, pager, next"
          :total="roleTotal"
          class="fireWallPage"
          style="float:right"
        ></el-pagination>
      </div>
    </div>
    <!--上传客群开始-->
    <el-dialog
      title="上传客群"
      :visible.sync="uploadingGroupVisible"
      class="uploadingGroupTitleClass"
      style="text-align:left;"
    >
      <el-form ref="importForm" :model="importForm" label-width="20%" style="padding-bottom: 50px;">
        <el-form-item label>
          <el-radio-group v-model="RadioUploadingGroup">
            <el-radio label="localFileUploading">本地文件</el-radio>
            <el-radio label="DSUploading">数据表同步</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客群名称">
          <el-input v-model="inputGroupName" placeholder="必填，不得超过20个字" style="width:80%;"></el-input>
        </el-form-item>
        <div v-if="RadioUploadingGroup == 'localFileUploading'">
          <el-form-item label="文件来源">
            <el-upload
              style="width:80%;"
              class="upload-demo"
              accept=".txt"
              ref="upload"
              multiple
              :limit="3"
              :auto-upload="false"
              :action='uploadUrl'
              :file-list="fileList"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              :on-change="uploadChange"
              :on-success="uploadList"
            >
              <el-button type="text" size="small" style="padding:0px 16px 0px 16px;">点击上传</el-button>
              <span slot="tip" class="el-upload__tip">只能上传.txt文件。</span>
            </el-upload>
          </el-form-item>
        </div>
        <div v-if="RadioUploadingGroup == 'DSUploading'">
          <el-form-item label="数据表名">
            <el-input v-model="sourcename" placeholder="必填，需要有相应表权限" style="width:80%;"></el-input>
          </el-form-item>
          <el-form-item label="id列名">
            <el-input v-model="idname" placeholder="必填，id在该表中所在的列名" style="width:80%;"></el-input>
          </el-form-item>
          <el-form-item label="筛选条件">
            <el-input
              v-model="screeningCriteria"
              type="textarea"
              placeholder="不需要写where，直接写过滤条件(SQL语法，如：AUM > 100 AND Age > 30)"
              style="width:80%;"
            ></el-input>
          </el-form-item>
        </div>
        <!-- <el-form-item style="margin:50px 20px 0 0; text-align:right;">
          <el-button @click="uploadingGroupVisible = false">取消</el-button>
          <el-button type="primary" @click="uploadFile">确定</el-button>
        </el-form-item> -->
      </el-form>
      <div class="footer_dialog">
        <el-button @click="uploadingGroupVisible = false">取消</el-button>
        <el-button type="primary" style="margin-right:20px;" @click="uploadFile">确定</el-button>
      </div>
    </el-dialog>
    <!--上传客群结束-->
    <!--客群合并开始-->
    <el-dialog
      title="客群并交"
      :visible.sync="mergeGroupVisible"
      class="uploadingGroupTitleClass"
      style="text-align:left;"
    >
      <el-form ref="form" label-width="20%" style="padding-bottom: 20px;">
        <el-form-item label="选择原客群">
          <el-autocomplete
            v-model="inputNewGroupNameOldOne"
            style="width:80%;"
            :fetch-suggestions="querySearchAsync"
            placeholder="可输入客群名搜索"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="选择交并关系">
          <el-radio-group v-model="mergingRelation">
            <el-radio :label="1">交集</el-radio>
            <el-radio :label="2">并集</el-radio>
            <el-radio :label="3">剔除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择交并客群">
          <el-autocomplete
            v-model="inputNewGroupNameOldTwo"
            style="width:80%;"
            :fetch-suggestions="querySearchAsync"
            placeholder="可输入客群名搜索"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="合并后新客群名">
          <el-input v-model="inputNewGroupNameNew" placeholder="必填，不得超过20个字" style="width:80%;"></el-input>
        </el-form-item>
        <!-- <el-form-item style="margin:50px 20px 0 0; text-align:right;">
          <el-button @click="mergeGroupVisible = false">取消</el-button>
          <el-button type="primary">确定</el-button>
        </el-form-item> -->
      </el-form>
      <div class="footer_dialog">
        <el-button @click="mergeGroupVisible = false">取消</el-button>
        <el-button @click="jiaoBingSave" type="primary" style="margin-right:20px;">确定</el-button>
      </div>
    </el-dialog>
    <!--客群合并结束-->

    <!--客群应用开始-->
    <el-dialog
      title="客群应用"
      :visible.sync="useGroupVisible"
      class="useGroupTitleClass"
      style="text-align:left;"
    >
      <div class="useGroupBody">
        <el-tabs v-model="useGroupTabsModel" @tab-click="useGroupTabsClick">
          <el-tab-pane label="周期人群投放" class="launchCycle" name="first" style="padding-bottom:20px;">
            <el-form ref="form" label-width="20%">
              <el-form-item label="同步至">
                <el-radio-group v-model="synchronizeToPushOne">
                  <el-radio label="synchronizePush">Push系统</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="同步客群">
                <el-autocomplete
                  v-model="synchronizeGroupNameOne"
                  style="width:80%;"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="可输入客群名搜索"
                  @select="handleSelect"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="有效期至">
                <el-date-picker
                  v-model="dateOfExpiryModel"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <span style="font-size:10px;margin-left:10px;color:#909399;">不填写默认15天，最多不超过90天</span>
              </el-form-item>
              <el-form-item label="">
                <el-checkbox v-model="autoUpdate">是否自动更新</el-checkbox>
                <span style="font-size:10px;margin-left:10px;color:#909399;">选择此项则每天计算并同步最新数据</span>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="单次人群同步" name="second">
            <el-form ref="form" label-width="20%" style="padding-bottom:100px;">
              <el-form-item label="同步至">
                <el-radio-group v-model="synchronizeToPushTwo">
                  <el-radio label="synchronizePushTwo">Push系统</el-radio>
                  <el-radio label="uploadLocalhost">下载至本地</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="同步客群">
                <el-autocomplete
                  v-model="synchronizeGroupNameTwo"
                  style="width:80%;"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="可输入客群名搜索"
                  @select="handleSelect"
                ></el-autocomplete>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- <el-form ref="form" label-width="20%">
        <el-form-item label="选择原客群">
          <el-autocomplete
            v-model="inputNewGroupNameOldOne"
            style="width:80%;"
            :fetch-suggestions="querySearchAsync"
            placeholder="可输入客群名搜索"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="选择交并关系">
          <el-radio-group v-model="mergingRelation">
            <el-radio :label="1">交集</el-radio>
            <el-radio :label="2">并集</el-radio>
            <el-radio :label="3">剔除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择交并客群">
          <el-autocomplete
            v-model="inputNewGroupNameOldTwo"
            style="width:80%;"
            :fetch-suggestions="querySearchAsync"
            placeholder="可输入客群名搜索"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="合并后新客群名">
          <el-input v-model="inputNewGroupNameNew" placeholder="必填，不得超过20个字" style="width:80%;"></el-input>
        </el-form-item>
      </el-form> -->
      <div class="footer_dialog">
        <el-button @click="useGroupVisible = false">取消</el-button>
        <el-button @click="useGroupSave" type="primary" style="margin-right:20px;">确定</el-button>
      </div>
    </el-dialog>
    <!--客群应用结束-->

    <!--分析开始-->
    <analysisDetails v-if="analysisDetailsVisible" ref="analysisDetails"></analysisDetails>
    <!--分析结束-->
 
  </div>
</template>
<script src="./index.js"></script>
<style>
.btnBox {
  margin-bottom: 10px;
  text-align: left;
}
.inputSearch {
  width: 20%;
  margin-left: 20px;
  height: 36px;
  line-height: 36px;
}
.inputSearch i {
  cursor: pointer;
}

/* 客群应用 */
.useGroupTitleClass .el-dialog__body {
  padding-top: 10px;
}

.uploadingGroupTitleClass .el-dialog__header {
  border-bottom: solid 1px rgba(0, 0, 0, 0.1);
  margin: 0 2%;
}
.useGroupTitleClass .el-dialog__header {
  border-bottom: solid 1px rgba(0, 0, 0, 0.1);
  margin: 0 2%;
}

</style>