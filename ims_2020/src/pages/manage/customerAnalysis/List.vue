<template>
  <div class="warp">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="历史分析"
        name="first"
      ></el-tab-pane>
      <el-tab-pane
        label="分析模板"
        name="second"
      ></el-tab-pane>
    </el-tabs>

    <div style="width:98%;margin: 20px 0 0 1%;">
      <div class="btnBox">
        <el-button
          type="primary"
          plain
          size="medium"
          @click="addAnalysisModel('add')"
        >创建分析模板</el-button>
        <el-input
          :placeholder="queryModelTemplate()"
          v-model="inputSearch"
          class="inputSearch"
          @input="searchGroupByName"
          @keyup.native.enter="searchGroupByName"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
          ></i>
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
              <el-button
                type="text"
                size="small"
                @click="analyzeGroup(scope.$index, tableData)"
                icon="el-icon-view"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="analysisTemplateBtn('update')"
              >修改</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="deletData(scope.$index, tableData)"
              >删除</el-button>
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
          >
          </el-table-column>
        </template>
      </el-table>
      <div
        class="block"
        style="margin-top:10px;"
      >
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
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      :title="analysisTemplate_title"
      :visible.sync="analysisTemplateModel"
      class="uploadingGroupTitleClass"
      style="text-align:left;"
    >
      <el-form
        ref="form"
        label-width="20%"
        style="margin-bottom:50px;"
      >
        <el-form-item label="分析主题名称">
          <el-input
           style="width:90%;"
            placeholder="必填，不得超过20个字"
            v-model="analysisTemplateForm.templateName"
            clearable>
          </el-input>
        </el-form-item>
        <div class="templateContent" v-for="(domain, index) in analysisTemplateForm.respList" :key="domain.key">
          <el-button v-if="analysisTemplateForm.respList.length > 1" @click="delAnalysisTemplate(domain)" type="danger" icon="el-icon-delete" circle style="padding:4px;position: absolute;right: 20px;cursor: pointer;z-index: 999;"></el-button>
          <el-form-item label="选择分析类型">
            <el-select
              v-model="domain.grpAnalStatus"
              placeholder="请选择"
              style="width:40%;"
            >
              <el-option
                v-for="item in grpAnalStatus_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button
              size="small"
              style="padding: 11px 15px;margin-left:10px;"
            >选择分析维度</el-button>
          </el-form-item>
           <!-- v-if="domain.dynamicTags && domain.dynamicTags.length > 0" -->
          <div class="indicatorwdBox" v-if="domain.dynamicTags && domain.dynamicTags.length > 0">已选维度：<el-tag
              :key="tag.LABLE_ID"
              v-for="tag in domain.dynamicTags"
              size="medium"
              effect="plain"
              closable
              style="margin-right:5px;"
              @close="handleClose(domain,tag)"
            >{{tag.LABLE_NAME}}</el-tag>
          </div>
          <el-row
            :span="24"
            class="indicatorBox"
          >
            <el-form-item
              label="统计指标"
              style="width:50%;display:inline-block;"
              label-width="40%"
            >
              <el-select
                v-model="domain.statisticalIndicators"
                placeholder="请选择"
                style="width:100%;"
              >
                <el-option
                  v-for="item in statisticalIndicators_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="统计方式"
              style="width:40%;display:inline-block;"
              label-width="40%"
            >
              <el-select
                v-model="domain.statistical"
                placeholder="请选择"
                style="width:90%;"
              >
                <el-option
                  v-for="item in statistical_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </div>
        <el-button
          style="margin:20px 0 0 20px;"
          icon="el-icon-plus"
          @click="addAnalysisTemplate()"
        >添加分析模块</el-button>
      </el-form>
      <div class="footer_dialog">
        <el-button @click="analysisTemplateModel = false">取消</el-button>
        <el-button @click="analysisModelUpdate" type="primary" style="margin-right:20px;">确定</el-button>
      </div>
    </el-dialog>

    <!--查看历史分析开始-->
    <analysisDetails
      v-if="analysisDetailsVisible"
      ref="analysisDetails"
    ></analysisDetails>
    <!--查看历史分析结束-->

  </div>
</template>
<script src="./index.js"></script>
<style scoped>
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
.indicatorwdBox {
  margin: 0 0 20px 20%;
}
.templateContent {
  background: rgba(0, 0, 0, 0.02);
  padding-top: 20px;
  margin-bottom: 10px;
  position: relative;
}
</style>