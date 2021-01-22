<template>
  <div style="">
    <el-dialog width='80%' style='text-align:left;' :visible.sync='modalShow'>
        <div>
            <!-- 客群信息开始 -->
            <div style="width:100%; margin:0 10px 30px 0"> 
                <span style="font-size:20px;">客群信息</span>
                <el-button
                type="text"
                class="updateConditionsButton"
                style="float:right"
                 >查看历史分析</el-button>
            </div>
            <div>
                <el-form :inline="true" v-model="groupInfoFrom1" class="demo-form-inline">
                <el-form-item label="客群名称：" style="width:280px">
                    {{ this.groupInfo.CUST_GRP_NAME }}
                </el-form-item>
                <el-form-item label="客群ID：" style="width:280px">
                    {{ this.groupInfo.CUST_GRP_ID }}
                </el-form-item>
                <el-form-item label="客群规模：" style="width:280px">
                    {{ this.groupInfo.CUST_GRP_SCOPE }}
                </el-form-item>
                </el-form>
                <el-form :inline="true" v-model="groupInfoFrom2" class="demo-form-inline">
                    <el-form-item label="客群来源："  style="width:280px">
                        {{ this.groupInfo.CUST_GRP_SOURCE=='1'?'条件筛选': (this.groupInfo.CUST_GRP_SOURCE=='2'?'客群交并':'客群上传') }}
                    </el-form-item>
                    <el-form-item label="筛选规则："  style="width:580px">
                        <el-input
                            style="width:400px"
                            type="textarea"
                            :autosize="{ minRows: 1, maxRows: 3}"
                            placeholder="请输筛选规则"
                            v-model="shaiXuanGuiZe">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 客群信息结束 -->
        </div>

        <div style='margin-top:50px;'>
            <el-form :inline="true" v-model="analysisModelDetails" class="demo-form-inline">
                <el-form-item label="分析名称"  style="width:450px">
                    <el-input
                        placeholder="请输入要添加的分析名称，不得超过20字"
                        v-model="analysisNameInput"

                        style="width:350px;"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addDanWeiClick">添加单维分析模块</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addDuoWeiClick">添加多维分析模块</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button>使用分析模板</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div>
            <h2 v-if="danweiAnalyList.length > 0">单维分析模块</h2>
            <div class="templateContent" v-for="(domain,index) in danweiAnalyList" :key="domain.key">
                <h3 style="font-size:16px;margin: 0;">{{domain.GRP_ANAL_NAME}}</h3>
                <div style="width:100%;overflow:hidden;">
                    <!-- <el-col :span="8"><p></p></el-col> -->
                    <p class="demo-form-inline-p">分析维度：{{domain.modelList[0].lableNameList.join("、")}}</p>
                    <p class="demo-form-inline-p">对比客群：{{domain.modelList[0].selectModelLableList[0].duiBiKeQunName}}</p>
                    <p class="demo-form-inline-p">统计指标：{{domain.modelList[0].tongJiZhiBiaoName}}</p>
                    <p class="demo-form-inline-p">统计方式：{{domain.modelList[0].STATISTICAL_METHODS}}</p>
                </div>
                <div :id="'analysisEcharts_contrast_'+index" style='width:100%;height:350px'></div>
            </div>
            <h2 v-if="duoWeiAnalyList.length > 0">多维分析模块</h2>
            <div class="templateContent" v-for="(domain,index) in duoWeiAnalyList" :key="domain.key">
                <h3 style="font-size:16px;margin: 0;">{{domain.GRP_ANAL_NAME}}</h3>
                <div style="width:100%;overflow:hidden;">
                    <p class="demo-form-inline-p">分析维度：{{domain.modelList[0].lableNameList.join("、")}}</p>
                    <p class="demo-form-inline-p">对比客群：{{domain.modelList[0].selectModelLableList[0].duiBiKeQunName}}</p>
                    <p class="demo-form-inline-p">统计指标：{{domain.modelList[0].tongJiZhiBiaoName}}</p>
                    <p class="demo-form-inline-p">统计方式：{{domain.modelList[0].STATISTICAL_METHODS}}</p>
                </div>
                <el-table
                :data="domain.modelList[0].dataList"
                max-height="250"
                border
                style="width: 100%;margin: auto;;">
                <el-table-column v-for="(items,i) in domain.modelList[0].rowAndColumn" :key="items.key" :label="items">
                    <template slot-scope="scope">	
                        <span v-html="cutout(getDataName(scope.row,items))"/> 
                    </template>
                </el-table-column>
                </el-table>
                
            </div>
        </div>
        <div slot='footer' class='dialog-footer'>
            <el-button @click='modalShow = false'>取 消</el-button>
            <el-button type='primary' @click='modalShow = false'>确 定</el-button>
        </div>
        
        
    </el-dialog>
        <!-- 单维分析开始 -->
        <!--统计图 -->
        <el-dialog
        style='text-align:left;'
        :visible.sync='tongjiVisible'
        width='90%'
        :before-close='handleClose'>
            <div>
                <div>
                    <input style="border:0px; width:400px;font-size:20px;"
                    @blur="outNNN"
                    v-bind:disabled="disabledInputName"
                    v-model="analysisNameInputUpDate"
                        value="请输入要添加的分析名称，不得超过20字"/>
                    <el-button type="text" class="el-icon-edit" @click="disabledInputName = false">编辑名称</el-button>
                </div>
                <div>
                    <el-form
                     label-width="100px"
                     :inline="true" v-model="analysisModelTitle" class="demo-form-inline">
                        <el-col :span="4">
                            <el-form-item label-width="0">
                                <!-- <el-autocomplete
                                    v-model="inputLableNameOne"
                                    :fetch-suggestions="querySearchLable"
                                    placeholder="可输入标签名搜索"
                                ></el-autocomplete> -->
                                <el-select v-model="inputLableNameOne" @change="inputLableNameOneChange()" placeholder="请选择">
                                    <el-option
                                    v-for="item in inputLableNameOneOptions"
                                    :key="item.LABLE_ID"
                                    :label="item.LABLE_NAME"
                                    :value="item.LABLE_ID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                            <!-- <el-form-item label="">
                                <el-cascader
                                placeholder="可输入标签名搜索"
                                v-model="inputLableNameOne"
                                filterable
                                :options="options"
                                @active-item-change="getNodes"
                                :props="props"
                                @change="inputLableNameOneChange($event)"
                                ></el-cascader>
                            </el-form-item> -->
                            <el-form-item label="对比客群" label-width="0">
                                <el-select v-model="getAllGroupInfoModel" @change="getAllGroupInfoModelChange($event)" placeholder="请选择">
                                    <el-option
                                    v-for="item in respGroupInfo"
                                    :key="item.CUST_GRP_ID"
                                    :label="item.CUST_GRP_NAME"
                                    :value="item.CUST_GRP_ID">
                                    </el-option>
                                </el-select>
                                <!-- <el-autocomplete
                                    @input="searchGroupByName"
                                    @keyup.native.enter="searchGroupByName"
                                    @click="searchGroupByName"
                                    v-model="searchGroupByNameModel"
                                    :fetch-suggestions="querySearchLable"
                                    placeholder="可输入标签名搜索"
                                ></el-autocomplete> -->
                            </el-form-item>
                            <el-form-item label="统计指标" label-width="0">
                                <el-select v-model="tongJiZhiBiao" @change="tongJiZhiBiaoChange($event)" placeholder="请选择">
                                    <el-option
                                    v-for="item in tongJiZhiBiaoOptions"
                                    :key="item.LABLE_ID"
                                    :label="item.LABLE_NAME"
                                    :value="item.LABLE_ID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="统计方式" label-width="0">
                                <el-select v-model="tongJiFangShi" placeholder="请选择">
                                    <el-option
                                    v-for="item in tongJiFangShiOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        
                    </el-form>
                </div>
                <div style="height:600px;"> 
                    <!-- ECharts图表 -->
                    <div id='analysisEcharts' style='width:90%;height:350px'>
                    </div>
                    <span slot='footer' style="float:right;" class='dialog-footer'>
                        <el-button @click='tongjiVisible = false'>取 消</el-button>
                        <el-button type='primary' @click='tongjiVisibleSave'>确 定</el-button>
                    </span>
                </div>
            </div>
        </el-dialog>
        <!-- 单维分析结束 -->
        <!-- 多维分析开始 -->
        <el-dialog
        style='text-align:left;'
        :visible.sync='duoWeiFenXiVisible'
        width='90%'
        :before-close='handleClose'>
            <div>
                <div>
                    <input style="border:0px; width:400px;font-size:20px;"
                    @blur="outNNN"
                    v-bind:disabled="disabledInputName"
                    v-model="analysisNameInputUpDate"
                        value="请输入要添加的分析名称，不得超过20字"/>
                    <el-button type="text" class="el-icon-edit" @click="disabledInputName = false">编辑名称</el-button>
                </div>
                <div>
                    <el-form :inline="true" v-model="analysisModelTitle" class="demo-form-inline">
                        <el-form-item label="">
                            <el-button
                                size="small"
                                style="padding: 11px 15px;margin-left:10px;"
                                @click="choiceDimClick()"
                                >选择分析维度</el-button>
                                <el-dialog
                                title="选择分析维度"
                                :visible.sync="dimDialogFormVisible"
                                style="text-align:left;"
                                append-to-body
                                @close="dimDialgClose"
                                >
                                    <el-form
                                    ref="form"
                                    style="margin-bottom:50px;"
                                    >
                                        <el-form-item label="选择维度">
                                            <el-select v-model="inputDimModel" filterable style="">
                                                <el-option 
                                                v-for="item in respDimInfo"
                                                :key="item.LABLE_ID"
                                                :label="item.LABLE_NAME"
                                                :value="item.LABLE_ID"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                    <div class="footer_dialog">
                                        <el-button @click="dimDialogFormVisible=false">取 消</el-button>
                                        <el-button type="primary" @click="chioceDimSaveClick()">确 定</el-button>
                                    </div>
                                </el-dialog>
                                <div class="indicatorwdBox" v-if="dynamicTags && dynamicTags.length > 0">已选维度：<el-tag
                                    :key="tag.LABLE_ID"
                                    v-for="tag in dynamicTags"
                                    size="medium"
                                    effect="plain"
                                    closable
                                    style="margin-right:5px;"
                                    @close="dynamicTagsClose(tag)"
                                    >{{tag.LABLE_NAME}}</el-tag>
                                </div>
                        </el-form-item>
                        <el-form-item label="统计方式" style="float:right;">
                            <el-select v-model="tongJiFangShi" placeholder="请选择">
                                <el-option
                                v-for="item in tongJiFangShiOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="统计指标" style="float:right;">
                            <el-select v-model="tongJiZhiBiao" placeholder="请选择">
                                <el-option
                                v-for="item in tongJiZhiBiaoOptions"
                                :key="item.LABLE_ID"
                                :label="item.LABLE_NAME"
                                :value="item.LABLE_ID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="对比客群" style="float:right;">
                            <el-select v-model="getAllGroupInfoModel" @change="duoWeiGroupInfoModelChange($event)" placeholder="请选择">
                                <el-option
                                v-for="item in respGroupInfo"
                                :key="item.CUST_GRP_ID"
                                :label="item.CUST_GRP_NAME"
                                :value="item.CUST_GRP_ID">
                                </el-option>
                            </el-select>
                            <!-- <el-autocomplete
                                @input="searchGroupByName"
                                @keyup.native.enter="searchGroupByName"
                                @click="searchGroupByName"
                                v-model="searchGroupByNameModel"
                                :fetch-suggestions="querySearchLable"
                                placeholder="可输入标签名搜索"
                            ></el-autocomplete> -->
                        </el-form-item>
                    </el-form>
                </div>
                <el-table
                    :data="tableData"
                    height="250"
                    border
                    style="width: 800px;margin: auto;margin-bottom:60px;">
                    <el-table-column
                    prop="date"
                    style="text-align: center;"
                    label="身份类型\性别"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="Male"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="Female">
                    </el-table-column>
                </el-table>
                <div>
                    <span slot='footer' style="float:right;" class='dialog-footer'>
                        <el-button @click='duoWeiFenXiVisible = false'>取 消</el-button>
                        <el-button type='primary' @click='duoWeiFenXiVisibleSave'>确 定</el-button>
                    </span>
                </div>
            </div>
        </el-dialog>
        <!-- 多维分析结束 -->
  </div>
</template>

<script>
import * as Api from '@/api/ManageApi';
var echarts = require('echarts');

    export default {
        
        name: 'index',
        data() {
            let _self = this;
            return {
                // 调用此页面传过来的custGrpId
                custGrpId:'',
                // 通过客群ID 查询的客群信息
                groupInfo:{},
                groupInfoFrom1:'',
                groupInfoFrom2:'',
                analysisModelDetails:'',
                analysisNameInput:'',
                disabledInputName: true,
                inputLableNameOne:'',
                analysisModelTitle:'',
                // 筛选规则
                shaiXuanGuiZe:'(性别=男 与 年龄>30) 或 (性别=女 与 年龄>20)',
                modalShow:false,
                formGroupInfo:{
                },
                analysisName:'',
                // 统计图
                tongjiVisible: false,

                // 搜索客群
                searchGroupByNameModel:'',
                restaurants: [],
                state: '',
                timeout: null,

                // 分析模板
                useAnalysisModel: [],
                templateId: '',

                // 统计指标
                tongJiZhiBiaoOptions: [],
                // 统计维度
                inputLableNameOneOptions: [],
                tongJiZhiBiao: '',
                // 统计方式
                 tongJiFangShiOptions: [{
                    value: '计数',
                    label: '计数'
                }, {
                    value: '加和',
                    label: '加和'
                }, {
                    value: '平均',
                    label: '平均'
                }],
                tongJiFangShi: '',
                duoWeiFenXiVisible: false,
                dynamicTags: [],
                tableData: [{
                    date: '中国内地',
                    name: [
                      '30000 (定存优惠客群)'
                    ,'20000 (test)'
                    ],
                    address: ['30000 (定存优惠客群)\n\n'
                    ,'\n20000 (test)']
                    }, {
                    date: ['中国内地在港居住'],
                    name: ['30000 (定存优惠客群)'
                    ,'20000 (test)'],
                    address: ['30000 (定存优惠客群)'
                    ,'20000 (test)']
                    }, {
                    date: ['香港及其他'],
                   name: ['30000 (定存优惠客群)'
                    ,'20000 (test)'],
                    address: ['30000 (定存优惠客群)'
                    ,'20000 (test)']
                }],
                ClassDataInfoList: [],
                // props: {
                //     // value: 'lableClassId',
                //     // label: 'lableClassName',
                //     emitPath: false,
                //     lazy: true,
                //     lazyLoad:this.lazyLoad,
                // }
                options: [],       
                props: {
                value: 'code',
                label: 'name',
                children: 'children',
                },
                respGroupInfo: [],
                lableOptionInfo: [],
                lableOptionNameInfo: [],
                analysisNameInputUpDate:'',
                getAllGroupInfoModel: '',
                // 分析类型 1、单维；2、多维
                grpAnalyStatus:'',
                groupAnalyList: [],
                // 单维集合
                danweiAnalyList: [],
                // 多维集合
                duoWeiAnalyList: [],
                // 当前的对比客群信息
                thisGroupData: [],
                // 当前操作的统计指标
                tongJiZhiBiaoData: [],
                // 当前客群单维统计数据
                dangQianKeQun: [],
                // 对比客群单维统计数据
                duiBiKeQun: [],
                // 最大值
                maxCount: 0,

                // 分析维度
                dimDialogFormVisible: false,
                inputDimModel: '',

                respDimInfo: [],
                duoWeiAnalyList_tabel: [],
            }
        },
        mounted: function() {
            this.restaurants = this.loadAll();
            this.getAnalysisModelName();
        },
        methods:{
            getDataName(scope,items){
                return scope[items]
            },
            init(res){
                // 接收参数
                this.custGrpId = res;
                // 显示页面
                this.modalShow = true;
                // 初始化页面数据
                this.initDataMethod();
                this.getClassDataInfo();
            },
            getClassDataInfo(){
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'getClassInfo',
                        userId: '',
                        branchId: '',
                        pageNo: 1,
                    },
                    BEQ_BODY: {},
                }
            
                Api.classDataInfo(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            res.data.classData.map(item => {
                                this.$set(item, 'code', item.lableClassId)
                                this.$set(item, 'name', item.lableClassName)
                                this.$set(item, 'children', [])
                            })
                            this.options = res.data.classData;
                            
                        }
                    }
                })
            },
            getLableInfoFun(id) {
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'getLableInfoByClassId',
                        userId: '',
                        branchId: '',
                        pageNo: 1,
                    },
                    BEQ_BODY: {
                        lableClassId: id
                    }
                }
                Api.getLableInfo(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            console.log(id)
                            res.data.lableInfo.map(item2 => {
                                item2.code = item2.lableId;
                                item2.name = item2.lableName;
                            })
                            console.log(this.options)
                            this.options.map((item, i) => {
                                if (item.code === id) {
                                    item.children = res.data.lableInfo
                                }
                            })
                        }
                    }
                })
            },
            getNodes(val) {
                if (val.length === 1) {
                    this.getLableInfoFun(val[0])
                }
            },
            initDataMethod() {
                // 通过客群ID 查询客群详情
                this.searchGroupById();
                // 查询统计方式
                this.getIndicators();
                // 查询统计维度
                this.getTongJiWeiDu();
                // 查询客群
                this.getAllGroupInfo();
                // // 查询单维或多维分析信息
                // this.groupAnalyListMethod();
            },
            // 查询单维、多维分析信息
            groupAnalyListMethod(){
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: "groupAnalyListMethod",
                    },
                    BEQ_BODY: {
                        custGrpId: this.custGrpId,
                        custGrpName: this.groupInfo.CUST_GRP_NAME,
                    }
                }
                Api.groupAnalyListMethod(params).then((res,index) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            this.groupAnalyList = res.data.groupAnalyList;
                            this.danweiAnalyList = [];
                            this.duoWeiAnalyList = [];
                            
                            // 单维
                            this.groupAnalyList.map(item => {
                                if(item.modelList[0].GRP_ANAL_STATUS == 1){ // 单维
                                    this.danweiAnalyList.push(item);
                                } else if(item.modelList[0].GRP_ANAL_STATUS == 2){ // 多维
                                    this.duoWeiAnalyList.push(item);
                                }
                            });
                            // 多维数据  
                            if(this.duoWeiAnalyList.length > 0){
                                this.duoWeiAnalyList.map(item => {
                                    item.modelList.map(item2 => {
                                        var duoWeiAnalyList_val = [];
                                        for(var a=0; a<item2.tableDataList.length; a++) {

                                            var data = {};
                                            for(var key in item2.rowAndColumn) {
                                                data[item2.rowAndColumn[key]] = item2.tableDataList[a][key];
                                            }
                                            duoWeiAnalyList_val.push(data);
                                        }
                                        item2.dataList = duoWeiAnalyList_val;
                                    })
                                })
                            }
                            // 单维数据
                            this.$nextTick(() => {
                                if(this.danweiAnalyList.length > 0){
                                    var selectModelLableList = [];
                                    this.danweiAnalyList.map(item => {
                                        item.modelList.map(item2 => {
                                            selectModelLableList.push(item2.selectModelLableList[0])
                                        })
                                    })
                                    selectModelLableList.map((item,index) => {
                                        var chart_option = {
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'cross',
                                                    crossStyle: {
                                                        color: '#999'
                                                    }
                                                }
                                            },
                                            legend: {
                                                data: [item.dangQianKeQunName, item.duiBiKeQunName],
                                                right: 10
                                            },
                                            xAxis: [
                                                {
                                                    type: 'category',
                                                    axisTick: {show: false},
                                                    data: item.optinList,
                                                    axisPointer: {
                                                        type: 'shadow'
                                                    }
                                                }
                                            ],
                                            yAxis: [
                                                {
                                                    type: 'value',
                                                    min: 0,
                                                    max: item.maxCount,
                                                    interval: item.maxCount/10,
                                                    axisLabel: {
                                                        formatter: '{value} 人'
                                                    }
                                                }
                                            ],
                                            series: [
                                                {
                                                    name: item.dangQianKeQunName,
                                                    type: 'bar',
                                                    data: item.dangQianKeQun,
                                                
                                                },
                                                {
                                                    name: item.duiBiKeQunName,
                                                    type: 'bar',
                                                    data: item.duiBiKeQun,
                                                
                                                }
                                            ]
                                        }
                                        var myChart = echarts.init(document.getElementById('analysisEcharts_contrast_'+index));
                                        myChart.setOption(chart_option)
                                         window.addEventListener("resize",function () {
                                            myChart.resize();
                                        })
                                    })
                                }
                            })
                           
                        }
                    }
                })
            },
            // 通过客群ID 查询客群详情
            searchGroupById(){
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: "searchGroupById",
                    },
                    BEQ_BODY: {
                        custGrpId: this.custGrpId,
                    }
                }
                Api.searchGroupById(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            console.log(res.data)
                            this.groupInfo = res.data.groupInfo;
                            console.log(this.groupInfo)
                            // 查询单维或多维分析信息
                            this.groupAnalyListMethod();
                        }
                    }
                })
            },
            modalClose() {
                this.modalShow = false;
            },
            // 分析
            // addDanAnalysisTemplate() {
            //     this.addDanAnalysisTemplate();
                
                
            // },
            handleClose(done) {
                this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
            },
            // 搜索客群
            loadAll() {
                return [
                    { 'value': '身份类型', 'address': '1' },
                    { 'value': '客户类型', 'address': '2' },
                    { 'value': '职业', 'address': '3' },
                ];
            },
            // 搜索模板名
            getAnalysisModelName(){
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'getAnalysisModelName',
                        userId: '',
                        branchId: '',
                        pageNo: 1,
                    },
                    BEQ_BODY: {
                    }
                }
                Api.getAnalysisModelName(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            console.log(res.data)
                            this.useAnalysisModel = res.data.lableInfo;
                            this.useAnalysisModel.unshift({
                                templateId:'',
                                templateName:''
                            });
                            
                            console.log(this.useAnalysisModel)
                        }
                    }
                })
            },
            // 
            querySearchLable(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                console.log(item);
            },
            // 添加分析模块
            addDanWeiClick(){
                this.grpAnalyStatus = '1';
                this.tongjiVisible = true;
                if(this.analysisNameInput != null && this.analysisNameInput != ''){
                    this.analysisNameInputUpDate = this.analysisNameInput;
                }
                
                this.$nextTick(() => {
                    var dom = document.getElementById('analysisEcharts');
                    console.log(dom)
                    var myChart = echarts.init(dom);
                    var app = {};
                    var option = null;
                    option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        toolbox: {
                            feature: {
                                // dataView: {show: true, readOnly: false},
                                // magicType: {show: true, type: ['line', 'bar']},
                                // restore: {show: true},
                                // saveAsImage: {show: true}
                            }
                        },
                        legend: {
                            data: [this.groupInfo.CUST_GRP_NAME, this.thisGroupData.CUST_GRP_NAME]
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: this.lableOptionNameInfo,
                                axisPointer: {
                                    type: 'shadow'
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: this.tongJiZhiBiaoData.LABLE_NAME,
                                min: 0,
                                max: this.maxCount,
                                interval: this.maxCount/10,
                                axisLabel: {
                                    formatter: '{value} 人'
                                }
                            }
                        ],
                        series: [
                            {
                                name: this.groupInfo.CUST_GRP_NAME,
                                type: 'bar',
                                data: this.dangQianKeQun,
                            },
                            {
                                name: this.thisGroupData.CUST_GRP_NAME,
                                type: 'bar',
                                data: this.duiBiKeQun,
                            }
                        ]
                    };
                    if (option && typeof option === 'object') {
                        myChart.setOption(option, true);
                    }
                })
            },
            addDuoWeiClick() {
                this.getDimInfo();
                this.grpAnalyStatus = '2';
                this.duoWeiFenXiVisible = true;
                this.analysisNameInputUpDate = this.analysisNameInput;
            },
            outNNN(){
                this.analysisNameInput = this.analysisNameInputUpDate;
                this.disabledInputName = true;
            },
            querySearchLable(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());
            },
            // 搜索客群
            searchGroupByName() {
                var searchInfoName = '';
                if (this.tabName === 'second') {
                    searchInfoName = 'searchTemplateByName';
                } else {
                    searchInfoName = 'searchGroupAnalysisByName';
                }
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: searchInfoName,
                        userId: '',
                        branchId: '',
                        pageNo: 1,
                    },
                    BEQ_BODY: {
                        page: this.pageNow,
                        pageSize: this.pageSize,
                        groupName: this.inputSearch
                    }
                }
                Api.searchGroupByName(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            console.log(res.data)
                            this.tableData = res.data.lableInfo;
                            this.roleTotal = res.data.count;
                        }
                    }
                })
            },
            getIndicators(){
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'getIndicators',
                    },
                    BEQ_BODY: {
                    }
                }
                Api.getIndicators(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            this.tongJiZhiBiaoOptions = res.data.respIndicators;
                        }
                    }
                })
            },
            getTongJiWeiDu(){
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'getTongJiWeiDu',
                    },
                    BEQ_BODY: {
                    }
                }
                Api.getTongJiWeiDu(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            this.inputLableNameOneOptions = res.data.inputLableNameOneOptions;
                        }
                    }
                })
            },
            getAllGroupInfo(){
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'getAllGroupInfo',
                    },
                    BEQ_BODY: {
                    }
                }
                Api.getAllGroupInfo(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            console.log(res.data)
                            this.respGroupInfo = res.data.respGroupInfo;
                        }
                    }
                })
            },
            inputLableNameOneChange() {
                console.log(this.inputLableNameOne);
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'getLableOptionByLableId',
                    },
                    BEQ_BODY: {
                        lableId: this.inputLableNameOne,
                        tongJiFangShi: this.tongJiFangShi,
                        tongJiZhiBiao: this.tongJiZhiBiao,
                        getAllGroupInfoModel: this.getAllGroupInfoModel,
                        custGrpId: this.groupInfo.CUST_GRP_ID,
                    }
                }
                Api.getLableOptionByLableId(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            this.lableOptionNameInfo = [];
                            console.log(res.data)
                            this.lableOptionInfo = res.data.lableOptionInfo;
                            this.dangQianKeQun = res.data.dangQianKeQun;
                            this.duiBiKeQun = res.data.duiBiKeQun;
                            this.maxCount = res.data.maxCount;
                            this.lableOptionInfo.map((item, index) => {
                                this.lableOptionNameInfo.push(item.LABLE_DTL_NAME);
                            })
                            console.log(this.lableOptionNameInfo);
                            this.addDanWeiClick();
                        }
                    }
                })
            },
            tongJiZhiBiaoChange(lableId){
                this.tongJiZhiBiaoOptions.map(item =>{
                    if(item.LABLE_ID == lableId){
                        this.tongJiZhiBiaoData = item;
                    }
                });
                this.addDanWeiClick();
            },
            getAllGroupInfoModelChange(custGrpid){
                this.respGroupInfo.map(item =>{
                    if(item.CUST_GRP_ID == custGrpid){
                        this.thisGroupData = item;
                    }
                });
                console.log(this.thisGroupData);
                this.addDanWeiClick();
            },
            tongjiVisibleSave() {
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'tongjiVisibleSave',
                    },
                    BEQ_BODY: {
                        analysisNameInputUpDate : this.analysisNameInputUpDate,
                        dynamicTags : this.dynamicTags,
                        tongJiZhiBiao : this.tongJiZhiBiao,
                        getAllGroupInfoModel : this.getAllGroupInfoModel,
                        inputLableNameOne : this.inputLableNameOne,
                        CUST_GRP_ID : this.groupInfo.CUST_GRP_ID,
                        grpAnalyStatus : this.grpAnalyStatus,
                    }
                }
                console.log(this.inputLableNameOne);
                Api.tongjiVisibleSave(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            this.analysisNameInputUpDate = '';
                            this.tongJiFangShi = '';
                            this.tongJiZhiBiao = '';
                            this.getAllGroupInfoModel = '';
                            this.inputLableNameOne = '';
                            this.grpAnalyStatus = '';
                            this.$message({
                                type: 'success',
                                message: '保存成功！',
                                offset: 100,
                            });
                            this.tongjiVisible = false;
                        }
                    }
                })
            },
            choiceDimClick() {
                if(this.dynamicTags.length === 2){
                    this.$message({
                        type: 'warning',
                        message: '多维分析只能选择2个维度！',
                        offset: 100,
                    });
                    return;
                }
                this.dimDialogFormVisible = true;
            },
            dimDialgClose() {
                this.inputDimModel = ''
            },
            getDimInfo() {
                this.respDimInfo = [];
                let params = {}
                Api.getDimInfo(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            if(res.data.respDimInfo != undefined && res.data.respDimInfo != null){
                                console.log(res.data.respDimInfo);
                                this.respDimInfo = res.data.respDimInfo;
                            }
                        }
                    }
                })
            },
            chioceDimSaveClick() {
                var lableRepeat = false;
                this.dynamicTags.map(item => {
                    if(this.inputDimModel == item.LABLE_ID){
                        this.$message({
                            type: 'warning',
                            message: '已存在该维度！',
                            offset: 100,
                        });
                        lableRepeat = true;
                    }
                });

                if(!lableRepeat){
                    this.respDimInfo.map(item2 => {
                        if(item2.LABLE_ID == this.inputDimModel){
                            this.dynamicTags.push({
                                LABLE_ID:item2.LABLE_ID,
                                LABLE_NAME:item2.LABLE_NAME
                            })
                        }
                    });
                } else {
                    return;
                }
                this.dimDialogFormVisible = false;
            },
            dynamicTagsClose(item){
                console.log(item);

                var index = this.dynamicTags.indexOf(item);
                if(index !== -1){
                    this.dynamicTags.splice(index, 1);
                }
            },
            duoWeiGroupInfoModelChange(custGrpid){
                this.respGroupInfo.map(item =>{
                    if(item.CUST_GRP_ID == custGrpid){
                        this.thisGroupData = item;
                    }
                });
            },
            // 多维客群保存
            duoWeiFenXiVisibleSave() {
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'duoWeiFenXiVisibleSave',
                    },
                    BEQ_BODY: {
                        analysisNameInputUpDate : this.analysisNameInputUpDate,
                        dynamicTags : this.dynamicTags,
                        tongJiFangShi : this.tongJiFangShi,
                        tongJiZhiBiao : this.tongJiZhiBiao,
                        getAllGroupInfoModel : this.getAllGroupInfoModel,
                        CUST_GRP_ID : this.groupInfo.CUST_GRP_ID,
                        grpAnalyStatus : this.grpAnalyStatus,
                    }
                }
                Api.duoWeiFenXiVisibleSave(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            this.analysisNameInputUpDate = '';
                            this.tongJiFangShi = '';
                            this.tongJiZhiBiao = '';
                            this.getAllGroupInfoModel = '';
                            this.grpAnalyStatus = '';
                            this.dynamicTags = [];
                            this.$message({
                                type: 'success',
                                message: '保存成功！',
                                offset: 100,
                            });
                            this.duoWeiFenXiVisible = false;
                        }
                    }
                })
            },
            // 截取数据
            cutout(cellValue) {
                return cellValue.replace(',', '</br>')
            }

        },
    };
    
    
</script>

<style scoped>
/* 去掉输入框边框 */
input{
  outline:none;
}
.el-table .cell{
    white-space: pre-line;
}
.demo-form-inline-p{
    font-size: 14px;
    color: rgba(0,0,0,0.8);
    display: inline-block;
    margin-right: 50px;
}
.templateContent{
    background: rgba(0,0,0,0.02);
    margin-top: 10px;
    padding: 10px;
}
</style>