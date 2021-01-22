<template>
  <div class="warp">
    <div class="headTab">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in ClassDataInfoList"
          :label="item.lableClassName"
          :name="item.lableClassId"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="contentBox">
      <div class="btnBox">
        <el-input
          placeholder="标签搜索"
          v-model="inputSearch"
          class="inputSearch"
          @input="search"
          @keyup.native.enter="search"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="search"
          ></i>
        </el-input>
      </div>
      <div class="tabActiveBox">
        <div style="width:100%;overflow: hidden;">
          <div
            style="color: rgba(0,0,0,0.5);padding: 20px 0 0 10px;"
            v-if="serachState"
          >搜到{{countNum}}个与"{{inputSearch}}"相关的结果：</div>
          <ul style="width:100%">
            <li
              style="width:24%"
              v-for="item in lableInfoList"
              @click="lableSelect(item)"
            >{{item.lableName}}</li>
          </ul>
        </div>
        <!-- 无数据 -->
        <div
          v-if="dataListNone"
          style="font-size:14px;color: #909399;width:100%;text-align:center;"
        >暂无数据</div>
      </div>
    </div>
    <div>
      <el-dialog
        title="手机设备平台类型"
        :visible.sync="dialogFormVisible"
      >
        <div style="padding-bottom:60px;">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="city in cities"
              :label="city"
              :key="city"
            >{{city}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="footer_dialog">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            @click="dialogFormVisible = false"
            type="primary"
            style="margin-right:20px;"
          >确定</el-button>
        </div>
        <!-- <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogFormVisible = false"
          >确 定</el-button>
        </div> -->
      </el-dialog>

      <!-- 数字类型开始 -->
      <el-dialog
        :title="lableTitleName"
        :visible.sync="numDialogFormVisible"
        style="text-align:left;"
      >
        <el-form
          ref="form"
          style="margin-bottom:50px;"
        >
          <div
            class="templateContent"
            v-for="(domain, index) in respList"
            :key="domain.key"
          >
            <div>
              <el-button
                v-if="respList.length > 1"
                @click="delAnalysisTemplate(domain)"
                type="danger"
                icon="el-icon-delete"
                circle
                style="padding:4px;position: absolute;right: 20px;cursor: pointer;z-index: 999;"
              ></el-button>
              <el-form-item style="width:50%;float:left;">
                <el-input
                  :disabled="domain.no_ageEnd"
                  placeholder="区间下限"
                  v-model.number="domain.ageEnd"
                  clearable
                >
                </el-input>
              </el-form-item>
              <el-form-item style="width:50%;float:left;">
                <el-checkbox
                  v-model="domain.no_ageEnd"
                  @change="domainEndCheckChange(index,domain)"
                  style="padding-left:30px;"
                >不设下限</el-checkbox>
              </el-form-item>
            </div>
            <div style="padding-bottom:20px;">至</div>
            <div>
              <el-form-item style="width:50%;float:left;">
                <el-input
                  :disabled="domain.no_ageStart"
                  placeholder="区间上限"
                  v-model.number="domain.ageStart"
                  clearable
                >
                </el-input>
              </el-form-item>
              <el-form-item style="width:50%;float:left;">
                <el-checkbox
                  v-model="domain.no_ageStart"
                  @change="domainStartCheckChange(index,domain)"
                  style="padding-left:30px;"
                >不设上限</el-checkbox>
              </el-form-item>
            </div>
          </div>
          <el-button
            style="margin-top:20px;"
            icon="el-icon-plus"
            @click="addAnalysisTemplate()"
          >新增区间</el-button>
        </el-form>

        <div class="footer_dialog">
          <el-button @click="numDialogFormVisible = false">取消</el-button>
          <el-button
            @click="numSaveClick"
            type="primary"
            style="margin-right:20px;"
          >确定</el-button>
        </div>
        <!-- <div>
          <el-button @click="numDialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="numDialogFormVisible = false"
          >确 定</el-button>
        </div> -->
      </el-dialog>
      <!-- 数字类型结束 -->
      <!-- 分类类型开始 -->
      <el-dialog
        :title="lableTitleName"
        :visible.sync="classDialogFormVisible"
        style="text-align:left;"
      >
        <div style="padding-bottom:60px;">
          <el-checkbox
            v-for="lableOptionData in lableOptionInfo"
            :label="lableOptionData.LABLE_DTL_NAME"
            :key="lableOptionData.LABLE_DTL_ID"
            v-model="lableOptionModel"
            style="width:25%; padding-bottom:25px;"
            @change="classChange"
          ></el-checkbox>
        </div>
        <div class="footer_dialog">
          <el-button @click="classDialogFormVisible = false">取消</el-button>
          <el-button
            @click="classSaveClick"
            type="primary"
            style="margin-right:20px;"
          >确定</el-button>
        </div>
        <!-- <div>
          <el-button @click="classDialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="classDialogFormVisible = false"
          >确 定</el-button>
        </div> -->
      </el-dialog>
      <!-- 分类类型结束 -->
      <div class="directionBox">
        <div class="directionBox_icon">
          <el-button
            type="primary"
            icon="el-icon-s-fold"
            circle
            @click="drawer = true"
          ></el-button>
        </div>
        <el-drawer
          :modal="false"
          :show-close="false"
          :with-header="false"
          :visible.sync="drawer"
          direction="rtl"
          size="40%"
        >
          <p class="selectedConditions">已选条件</p>
          <div
            class="selectGroup"
            v-show="showSelectGroup"
          >
            <hr style="height:1px;border:none;border-top:1px solid darkgray; margin: 2%" />
            <p class="manZu">满足以下条件的客群约</p>
            <!--满足条件部分-->
            <div class="selectCondition">
              <!--右上角-->
              <div class="topRightCorner"></div>
              <!--左上角-->
              <div class="topLeftCorner"></div>
              <!--左下角-->
              <div class="leftBottom"></div>
              <!--右下角-->
              <div class="lowerRightCorner"></div>

              <div class="groupContentMain">
                <el-tree
                  style="margin-bottom:66px;"
                  :data="yuHuoData"
                  node-key="id"
                  icon-class="none"
                  :expand-on-click-node="false"
                  default-expand-all
                  class="tree_list_view"
                >
                  <span
                    class="custom-tree-node-main"
                    slot-scope="{ node, data }"
                  >
                    <span>
                      <el-checkbox v-model="data.isChecked">
                        <span>
                          <el-select
                            disabled
                            icon-class="none"
                            v-model="data.relationStatus"
                            class="yuHuoClass"
                          >
                            <el-option
                              v-for="item in yuHuoOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </span>
                        {{node.relationStatus}}
                      </el-checkbox>
                    </span>
                    <span>{{ node.label }}</span>
                    <span style="float:right;margin-right:10px;">{{ data.num }}</span>
                  </span>
                </el-tree>
                <!-- <el-checkbox-group v-model="checkList">
                  <div
                    v-for="(item,index) in switchArray"
                    :key="item.value"
                    style="position: relative;"
                  >
                    <div class="groupContentMain_checkList" :style="{'margin-left':20*item.indexId+'px'}">
                      <el-checkbox style="width:50%" :label="item.label">{{item.label}}</el-checkbox>
                      <span class="checkNum">{{item.num}}</span>
                    </div>
                    <div class="lineContent" :style="{'left':80*index+'px'}" v-if="switchArray.length != index+1">
                      <div class="line_top_1" style="width:30px;"></div>
                      <div class="line_top_2"></div>
                      <el-select
                        v-model="item.relationStatus"
                        placeholder="请选择"
                        style="width: 60px;margin: 3px 0 3px -5px;z-index: 999;"
                      >
                        <el-option
                          v-for="rela in relationStatus_list"
                          :key="rela.value"
                          :label="rela.label"
                          :value="rela.value"
                        >
                        </el-option>
                      </el-select>
                      <div class="line_top_2"></div>
                      <div class="line_top_1" style="margin-left: -170px"></div>
                     </div>
                  </div>
                </el-checkbox-group> -->
              </div>
              <el-button
                type="text"
                class="updateConditionsButton"
                @click="xiuGaiTiaoJianClick"
              >修改条件关系</el-button>
            </div>

          </div>
          <el-button
            type="primary"
            class="saveGroupButton"
          >保存客群</el-button>
        </el-drawer>
      </div>
    </div>

    <!-- 条件修改开始 -->
    <el-dialog
      title="条件关系修改"
      :visible.sync="tiaoJianXiuXiuGai"
      class="tiaoJainXiuGaiClass"
      style="text-align:left;"
    >
      <!-- <tiaoJainXiuGaiDetails
        v-if="tiaoJianXiuGaiDetailsVisible"
        ref="tiaoJianXiuGaiDetails"
      ></tiaoJainXiuGaiDetails> -->

      <el-tree
        style="margin-bottom:66px;border-bottom: solid 1px rgba(0,0,0,0.05);"
        :data="yuHuoData"
        node-key="id"
        class="tree_list_box"
        default-expand-all
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        role="treeitem"
        icon-class="none"
        :expand-on-click-node="false"
        draggable
        >
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <el-select v-model="data.relationStatus" style="width:65px;">
            <el-option
              v-for="item in yuHuoOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
        {{node.relationStatus}}
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>


      <div class="footer_dialog">
        <el-button @click="tiaoJianXiuXiuGai = false">取消</el-button>
        <el-button
          @click="tiaoJianGuanXiSave"
          type="primary"
          style="margin-right:20px;"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 条件修改结束 -->
  </div>

</template>
<script src="./index.js"></script>

<style>
.contentBox {
  margin-top: 20px;
  width: 98%;
  margin-left: 1%;
}
.btnBox {
  margin-bottom: 10px;
  text-align: left;
}
.tabActiveBox {
  text-align: left;
  padding: 20px;
  border: 1px solid #e4e6ec;
  overflow: hidden;
}
.tabActiveBox ul {
  padding: 20px 0 0 26px;
}
.tabActiveBox ul li {
  float: left;
  width: 14%;
  font-size: 14px;
  padding: 10px 10px 10px 0;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.85);
}
.inputSearch {
  width: 20%;
}
.inputSearch i {
  cursor: pointer;
}
.headTab {
  margin-top: 20px;
}
.directionBox {
  z-index: 999;
}
.directionBox_icon {
  display: inline-block;
  position: fixed;
  right: 10px;
  bottom: 100px;
}
.el-drawer__wrapper {
  top: 60px;
  padding-top: 20px;
}
/* 条件部分开始 */
.selectCondition {
  margin: 3%;
  border: 1px dashed blue;
  position: relative;
}
.topRightCorner {
  height: 3px;
  width: 3px;
  border: 2px solid blue;
  border-left-color: white;
  border-bottom-color: white;
  position: absolute;
  top: -1px;
  right: -1px;
}
.topLeftCorner {
  height: 3px;
  width: 3px;
  border: 2px solid blue;
  border-right-color: white;
  border-bottom-color: white;
  position: absolute;
  top: -1px;
  left: -1px;
}
.leftBottom {
  height: 3px;
  width: 3px;
  border: 2px solid blue;
  border-right-color: white;
  border-top-color: white;
  position: absolute;
  bottom: -1px;
  left: -1px;
}
.lowerRightCorner {
  height: 3px;
  width: 3px;
  border: 2px solid blue;
  border-left-color: white;
  border-top-color: white;
  position: absolute;
  bottom: -1px;
  right: -1px;
}
/* 条件部分结束 */
/*【满足以下条件约束的客群约】的样式 */
.manZu {
  font-size: 15px;
  margin-left: 5%;
  text-align: left;
  color: darkgray;
}
/*【已选条件】 */
.selectedConditions {
  font-size: 18px;
  text-align: left;
  margin-left: 5%;
}
/*修改条件关系按钮 */
.updateConditionsButton {
  width: 100%;
  text-align: left;
  margin-left: 2%;
}
/*保存客群按钮 */
.saveGroupButton {
  width: 95%;
  margin-top: 50px;
}

.groupContentMain {
  padding-top: 20px;
  text-align: left;
  margin: 0 10px;
}
/* .groupContentMain_checkList {
    text-align: left;
    padding: 10px;
    line-height: 36px;
  } */
.checkNum {
  font-size: 14px;
  float: right;
}
.lineContent {
  margin-left: 50%;
  position: absolute;
  top: 30px;
  text-align: left;
}
.line_top_1 {
  width: 200px;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}
.line_top_2 {
  width: 1px;
  height: 10px;
  background: rgba(0, 0, 0, 0.1);
  margin-left: 29px;
}
/* 条件树显示开始 */
.custom-tree-node-main {
  flex: 1;
  /* display: flex; */
  /* align-items: center; */
  justify-content: space-between;
  font-size: 14px;
  /* padding-right: 8px; */
}
.custom-tree-node-main .el-input__inner {
  border: hidden;
  text-align: center;
  height: 25px;
  width: 25px;
  padding: 0;
}
/* 条件树显示结束 */
/* 与、或下拉框 */
.yuHuoClass .el-select__caret.el-input__icon.el-icon-arrow-up {
  display: none;
}

.tree_list_view.el-tree .is-focusable {
  border: solid 1px rgba(0, 0, 0, 0.05);
  padding: 5px 10px;
  border-bottom: none;
}
.tree_list_view.el-tree .el-tree-node__children .is-focusable {
  border: none;
}
.templateContent {
  background: rgba(0, 0, 0, 0.02);
  margin-bottom: 10px;
  position: relative;
  padding: 20px 10px 0;
  overflow: hidden;
}
/* 条件树显示开始 */
.custom-tree-node {
    flex: 1;
    /* display: flex; */
    /* align-items: center; */
    justify-content: space-between;
    font-size: 14px;
    /* padding-right: 8px; */
}
.custom-tree-node .el-input__inner,.custom-tree-node .el-input__icon{
  /* border:0; */
  /* height: 25px;
  width: 65px;
  margin: 2px 0px; */
  height: 25px;
  line-height: 25px;
}
/* 条件树显示结束 */
.tree_list_box.el-tree .is-focusable{
  border:solid 1px rgba(0,0,0,0.05);
  padding:5px 10px;
  border-bottom: none;
}
.tree_list_box.el-tree .el-tree-node__children .is-focusable{
  border:none;
}
</style>