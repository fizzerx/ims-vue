import * as Api from '../../../api/ManageApi';
import analysisDetails from './analysisDetails/AnalysisDetails.vue';
// 当前操作页，默认first(历史分析)
var tabName = '';
export default {

    components: {
        analysisDetails
    },

    data() {
        return {
            activeName: 'first',
            pageSize: 10,
            pageNow: 1,
            roleTotal: 0,
            tableConfig: [
                { label: 'ID', prop: 'grpAnalId', },
                { label: '分析名称', prop: 'grpAnalName', },
                { label: '分析者', prop: 'create', },
                { label: '分析客群', prop: 'custGrpName', },
                { label: '分析时间', prop: 'createDate', },
                {
                    label: '执行状态',
                    prop: 'executiveStatus',
                    formatter: function(row, column) {
                        var v = row[column.property];
                        var val = '未执行';
                        switch (v) {
                            case 'N':
                                val = '未执行';
                                break;
                            case 'Y':
                                val = '执行成功';
                                break;
                            case 'F':
                                val = '执行失败';
                                break;
                            default:
                        }
                        return val;
                    }
                },
                { label: '操作', operations: 'operations', width: 300 },
            ],
            tableData: [],
            inputSearch: '',

            // 分析
            analysisDetailsVisible: false,
            analysisTemplateModel: false,
            analysisTemplate_title: '创建分析模板',
            grpAnalStatus_list: [{
                    value: '1',
                    label: '单维分析'
                },
                {
                    value: '2',
                    label: '多维分析'
                }
            ],
            statisticalIndicators_list: [{
                value: '1',
                label: 'Cust_Id'
            }],
            statistical_list: [{
                    value: '计数',
                    label: '计数'
                },
                {
                    value: '加和',
                    label: '加和'
                },
                {
                    value: '平均',
                    label: '平均'
                }
            ],
            analysisTemplateForm: {
                templateName: '',
                respList: [{
                    grpAnalStatus: '',
                    statisticalIndicators: '',
                    statistical: '',
                    dynamicTags: [{
                        LABLE_ID: 'LB000001',
                        LABLE_NAME: '年龄'
                    }, {
                        LABLE_ID: 'LB000002',
                        LABLE_NAME: '职业'
                    }],
                }],
            },
            queryTemplateId: '',
        };
    },
    mounted: function() {
        this.searchGroupByName();
    },

    methods: {
        // 搜索提示
        queryModelTemplate() {
            return (this.tabName === 'second') ? '分析模板搜索' : '历史分析搜索';
        },

        handleClick(tab, event) {
            this.tabName = tab.name;
            if (tab.name === 'first') {
                this.tableConfig = [
                    { label: 'ID', prop: 'grpAnalId', },
                    { label: '分析名称', prop: 'grpAnalName', },
                    { label: '分析者', prop: 'create', },
                    { label: '分析客群', prop: 'custGrpName', },
                    { label: '分析时间', prop: 'createDate', },
                    {
                        label: '执行状态',
                        prop: 'executiveStatus',
                        formatter: function(row, column) {
                            var v = row[column.property];
                            var val = '未执行';
                            switch (v) {
                                case 'N':
                                    val = '未执行';
                                    break;
                                case 'Y':
                                    val = '执行成功';
                                    break;
                                case 'F':
                                    val = '执行失败';
                                    break;
                                default:
                            }
                            return val;
                        }
                    },
                    { label: '操作', operations: 'operations', width: 300 },
                ];
                this.tableData = [];
                this.searchGroupByName(tab.name)
            } else if (tab.name === 'second') {
                this.tableConfig = [
                    { label: 'ID', prop: 'templateId', },
                    { label: '模板名称', prop: 'templateName', },
                    { label: '创建者', prop: 'creater', },
                    { label: '创建时间', prop: 'createDate', },
                    { label: '使用次数', prop: 'userNumber', },
                    { label: '操作', operations: 'operations', width: 300 },
                ];
                this.tableData = [];
                this.searchGroupByName(tab.name)
            }
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
                        // console.log(res.data)
                        this.tableData = res.data.lableInfo;
                        this.roleTotal = res.data.count;
                    }
                }
            })
        },
        //pageSize 改变时会触发（每頁条数）
        handleSizeChange(val) {
            this.pageSize = val;
            this.searchGroupByName();
        },
        //当前页数
        handleCurrentChange(val) {
            this.pageNow = val;
            this.searchGroupByName();
        },
        // 查看分析或模板
        analyzeGroup(index, row) {
            if (this.tabName === 'second') {
                this.analysisTemplate_title = '查看分析模板';
                this.queryTemplateId = row[index].templateId;
                this.analysisTemplateModel = true;
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'queryTemplateById',
                        userId: '',
                        branchId: '',
                        pageNo: 1,
                    },
                    BEQ_BODY: {
                        queryTemplateId: this.queryTemplateId,
                    }
                }
                Api.queryTemplateById(params).then((res) => {
                    // console.log(res.data)
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            this.analysisTemplateForm = res.data;
                        }
                    }
                })
            } else {
                this.analysisDetailsVisible = true;
                this.$nextTick(() => {
                    this.$refs.analysisDetails.init();
                })
            }
        },
        // 新增分析模板
        addAnalysisModel(res) {

            this.analysisTemplate_title = '创建分析模板';
            this.analysisTemplateModel = true;
            this.analysisTemplateForm = {
                templateName: '',
                respList: [{
                    grpAnalStatus: '',
                    statisticalIndicators: '',
                    statistical: '',
                    dynamicTags: [{
                        LABLE_ID: 'LB000000001',
                        LABLE_NAME: '年龄'
                    }, {
                        LABLE_ID: 'LB000000002',
                        LABLE_NAME: '手机型号！'
                    }],
                }],
            }
        },
        // 删除
        deletData(index, row) {
            var searchInfo = '';
            var delename = '';
            var deleteId = '';
            if (this.tabName === 'second') {
                searchInfo = '此操作将永久删除该模板, 是否继续?';
                delename = 'deleTemplate';
                deleteId = row[index].templateId;
            } else {
                searchInfo = '此操作将永久删除该客群分析, 是否继续?';
                delename = 'deleAnalytical';
                deleteId = row[index].grpAnalId;
            }
            // console.log(row[index].custGrpId)
            this.$confirm(searchInfo, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: delename,
                        userId: '',
                        branchId: '',
                        pageNo: 1,
                    },
                    BEQ_BODY: {
                        deleteId: deleteId,
                    }
                }
                Api.deleteGroup(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            row.splice(index, 1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                                offset: 100,
                            });
                        }
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                    offset: 100,
                });
            });
        },
        // 修改
        analysisTemplateBtn(type) {
            if (this.tabName === 'second') {
                this.analysisTemplate_title = '修改分析模板';
                this.analysisTemplateModel = true;

            } else {
                this.analysisDetailsVisible = true;
                this.$nextTick(() => {
                    this.$refs.analysisDetails.init();
                })
            }
        },
        addAnalysisTemplate() {
            this.analysisTemplateForm.respList.push({
                grpAnalStatus: '',
                statisticalIndicators: '',
                statistical: '',
                dynamicTags: [{
                    LABLE_ID: 'LB000000001',
                    LABLE_NAME: '年龄'
                }, {
                    LABLE_ID: 'LB000000002',
                    LABLE_NAME: '手机型号！'
                }],
                key: Date.now(),
            })
        },
        delAnalysisTemplate(item) {
            var index = this.analysisTemplateForm.respList.indexOf(item)
            if (index !== -1) {
                this.analysisTemplateForm.respList.splice(index, 1)
            }
        },
        handleClose(domain, tag) {
            var index = domain.dynamicTags.indexOf(tag);
            if (index !== -1) {
                domain.dynamicTags.splice(index, 1)
            }
            // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        // 创建分析模板
        analysisModelUpdate() {
            // console.log(this.analysisTemplate_title)
            if (this.analysisTemplate_title == '创建分析模板') {
                this.$message({
                    type: 'success',
                    message: '创建成功!',
                    offset: 100,
                });
                setTimeout(() => {
                    this.analysisTemplateModel = false;
                }, 2000);
            } else if (this.analysisTemplate_title == '修改分析模板') {
                this.$message({
                    type: 'success',
                    message: '修改成功!',
                    offset: 100,
                });
                setTimeout(() => {
                    this.analysisTemplateModel = false;
                }, 2000);
            }


        },
    },

};