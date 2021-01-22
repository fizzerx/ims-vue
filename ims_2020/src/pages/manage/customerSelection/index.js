import * as Api from '../../../api/ManageApi';
// import tiaoJainXiuGaiDetails from './tiaoJianXiuGaiDetails';
const cityOptions = ['Android', 'IOS'];
let Base64 = require('js-base64').Base64;
export default {
    // components: {
    //     tiaoJainXiuGaiDetails
    // },
    data() {
        return {
            activeName: '',
            ClassDataInfoList: [],
            lableInfoList: [],
            inputSearch: '',
            countNum: 0,
            serachState: false,
            dataListNone: false,
            // 弹框
            dialogFormVisible: false,
            formLabelWidth: '130px',
            checkAll: false,
            checkedCities: ['Android'],
            cities: cityOptions,
            isIndeterminate: true,
            drawer: false,

            // 标签筛选条件是否显示
            showSelectGroup: true,
            yuHuoData: [],
            treeLength: 0,
            yuHuoOptions: [{
                value: 0,
                label: '与'
            }, {
                value: 1,
                label: '或'
            }],

            // checkList: [],
            // relationStatus_list: [{
            //         value: 0,
            //         label: '或'
            //     },
            //     {
            //         value: 1,
            //         label: '与'
            //     }
            // ],
            // switchArray: [
            //     { indexId: 0, label: '手机设备平台类型：Andioid', value: '1', num: '1,102,282', relationStatus: 1 },
            //     { indexId: 0, label: '婚姻状况：已婚', value: '2', num: '102,232', relationStatus: 0 },
            //     { indexId: 1, label: '教育程度：高中', value: '3', num: '22', relationStatus: 1 },
            //     { indexId: 1, label: '年龄：20', value: '4', num: '22', relationStatus: 1 },
            //     { indexId: 1, label: '性别：男', value: '5', num: '22', relationStatus: 1 },
            //     { indexId: 2, label: '年龄：20', value: '6', num: '22', relationStatus: 1 },
            //     { indexId: 3, label: '年龄：20', value: '7', num: '22', relationStatus: 1 },
            // ],

            // 条件修改
            tiaoJianXiuXiuGai: false,
            tiaoJianXiuGaiDetailsVisible: true,
            numDialogFormVisible: false,
            lableTitleName: '',
            lableOptionInfo: [{
                LABLE_DTL_ID: '',
                LABLE_DTL_NAME: '',
            }],
            classDialogFormVisible: false,
            respList: [{
                ageStart: '',
                no_ageStart: false,
                ageEnd: '',
                no_ageEnd: false,
            }],
            // 当前标签ID
            currentLableId: '',
            // 查询客户的个数
            customerNum: '',
            lableOptionModel: [],
        };
    },
    mounted: function() {
        this.getClassDataInfo();
    },
    methods: {
        handleCheckAllChange(val) {
            this.checkedCities = val ? cityOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        lableSelect(res) {
            // if (res.lableId === 'L1000001') {
            //     this.dialogFormVisible = true;
            // }
            this.lableTitleName = res.lableName;
            console.log(res)
            this.currentLableId = res.lableId;
            if (res.lableType == 'class') { // 分类类型
                this.classDialogFormVisible = true;

                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'getLableOptionByLableId',
                    },
                    BEQ_BODY: {
                        lableId: res.lableId
                    }
                }
                Api.getLableOptionByLableId(params).then((res) => {
                    if (res.status == 200) {
                        if (res.data.respCode == 0) {
                            this.lableOptionInfo = res.data.lableOptionInfo;
                            console.log(this.lableOptionInfo);
                        }
                    } else {
                        // this.dataListNone = true;
                    }
                })
            } else if (res.lableType == 'num') { // 数字类型
                this.currentLableId = res.lableId;
                this.numDialogFormVisible = true;
            } else if (res.lableType == 'date') { // 日期类型

            } else if (res.lableType == 'country') { // 国家列表类型

            } else if (res.lableType == 'other') { // 其他类型

            }
        },
        handleClick(tab, event) {
            this.serachState = false;
            this.lableInfoList = [];
            this.getLableInfoFun(tab.name)
        },
        getClassDataInfo() {
            let params = {
                REQ_HEAD: {
                    TransServiceCode: 'getClassInfo',
                    userId: '',
                    branchId: '',
                    pageNo: 1,
                },
                BEQ_BODY: {}
            }
            Api.classDataInfo(params).then((res) => {
                this.customerNum = '2222222';
                // console.log(res)
                if (res.status == 200) {
                    if (res.data.respCode == 0) {
                        this.activeName = res.data.classData[0].lableClassId;
                        this.ClassDataInfoList = res.data.classData;
                        this.getLableInfoFun(res.data.classData[0].lableClassId);
                        if (this.ClassDataInfoList.length == 0) {
                            this.dataListNone = true;
                        } else {
                            this.dataListNone = false;
                        }
                    }
                } else {
                    this.dataListNone = true;
                }
            }).catch(error => {
                this.dataListNone = true;
            });
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
                        this.lableInfoList = res.data.lableInfo;
                        if (this.lableInfoList.length == 0) {
                            this.dataListNone = true;
                        } else {
                            this.dataListNone = false;
                        }
                    }
                } else {
                    this.dataListNone = true;
                }
            })
        },
        search() {
            let params = {
                REQ_HEAD: {
                    TransServiceCode: 'getLableInfoByLableName',
                    userId: '',
                    branchId: '',
                    pageNo: 1,
                },
                BEQ_BODY: {
                    lableName: this.inputSearch
                }
            }
            Api.getLableInfoByLableName(params).then((res) => {
                if (res.status == 200) {
                    if (res.data.respCode == 0) {
                        this.serachState = true;
                        this.countNum = 0;
                        if (res.data.lableInfo !== undefined &&
                            res.data.lableInfo !== null) {
                            this.countNum = res.data.lableInfo.length;
                        }
                        this.lableInfoList = res.data.lableInfo;
                        if (this.lableInfoList.length == 0) {
                            this.dataListNone = true;
                        } else {
                            this.dataListNone = false;
                        }
                    }
                }
            })
        },
        tiaoJianGuanXiSave() {
            this.tiaoJianXiuXiuGai = false;
            console.log(this.yuHuoData)
        },
        xiuGaiTiaoJianClick() {
            this.tiaoJianXiuXiuGai = true;
        },
        classSaveClick() {
            this.classDialogFormVisible = false
            var tiaoJian = '';
            this.numDialogFormVisible = false;
            console.log(this.respList);
            console.log(this.currentLableId);
            let params = {
                REQ_HEAD: {
                    TransServiceCode: 'getCustomerNumByClass',
                },
                BEQ_BODY: {
                    lableId: this.currentLableId,
                    lableCriteria: this.lableOptionModel
                }
            }
            Api.getCustomerNum(params).then((res) => {
                if (res.status == 200) {
                    if (res.data.respCode == 0) {
                        if (res.data.num !== undefined &&
                            res.data.num !== null) {
                            this.customerNum = res.data.num;
                            for (var i = 0; i < this.lableOptionInfo.length; i++) {
                                tiaoJian = '';
                            }
                            console.log(this.treeLength)
                            this.treeLength = this.treeLength + 1;
                            this.yuHuoData.push({
                                id: this.treeLength,
                                isChecked: true,
                                label: this.lableTitleName + ':' + tiaoJian,
                                children: [],
                                num: this.customerNum,
                                relationStatus: 0
                            });
                        }
                    }
                }
            })

        },
        // 年龄区间设置
        addAnalysisTemplate() {
            this.respList.push({
                ageStart: '',
                no_ageStart: false,
                ageEnd: '',
                no_ageEnd: false,
                key: Date.now(),
            })
        },
        delAnalysisTemplate(item) {
            var index = this.respList.indexOf(item)
            if (index !== -1) {
                this.respList.splice(index, 1)
            }
        },
        domainEndCheckChange(index, row) {
            this.respList.map((item, index2) => {
                if (index == index2 && row.no_ageEnd) {
                    this.$set(item, 'ageEnd', '')
                    return item
                }
            })
        },
        domainStartCheckChange(index, row) {
            this.respList.map((item, index2) => {
                if (index == index2 && row.no_ageStart) {
                    this.$set(item, 'ageStart', '')
                    return item
                }
            })
        },
        numSaveClick() {
            this.numDialogFormVisible = false;
            console.log(this.respList);
            console.log(this.currentLableId);
            let params = {
                REQ_HEAD: {
                    TransServiceCode: 'getCustomerNum',
                },
                BEQ_BODY: {
                    lableId: this.currentLableId,
                    lableCriteria: this.respList
                }
            }
            Api.getCustomerNum(params).then((res) => {
                if (res.status == 200) {
                    if (res.data.respCode == 0) {
                        if (res.data.num !== undefined &&
                            res.data.num !== null) {
                            this.customerNum = res.data.num;
                            for (var i = 0; i < this.respList.length; i++) {
                                var tiaoJian = '';
                                var lableId = this.respList[i].lableId;
                                if (!this.respList[i].no_ageStart) {
                                    tiaoJian = tiaoJian + this.respList[i].ageStart;
                                }
                                if (!this.respList[i].no_ageEnd) {
                                    if (!this.respList[i].no_ageStart) {
                                        tiaoJian = tiaoJian + "-" + this.respList[i].ageEnd;
                                    } else {
                                        tiaoJian = tiaoJian + this.respList[i].ageEnd;
                                    }

                                }
                            }
                            console.log(this.treeLength)
                            this.treeLength = this.treeLength + 1;
                            this.yuHuoData.push({
                                id: this.treeLength,
                                isChecked: true,
                                label: this.lableTitleName + ':' + tiaoJian,
                                children: [],
                                num: this.customerNum,
                                relationStatus: 0
                            });
                        }
                    }
                }
            })



        },
        classChange(row) {
            console.log(row)
        },

        // 条件修改界面
        handleDragStart(node, ev) {
            console.log('drag start', node);
        },
        handleDragEnter(draggingNode, dropNode, ev) {
            console.log('tree drag enter: ', dropNode.label);
        },
        handleDragLeave(draggingNode, dropNode, ev) {
            console.log('tree drag leave: ', dropNode.label);
        },
        handleDragOver(draggingNode, dropNode, ev) {
            console.log('tree drag over: ', dropNode.label);
        },
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            console.log('tree drag end: ', dropNode && dropNode.label, dropType);
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
            console.log('tree drop: ', dropNode.label, dropType);
        },


        // 增加删除
        append(data) {
            const newChild = { id: id++, label: 'testtest', children: [] };
            if (!data.children) {
                this.$set(data, 'children', []);
            }
            data.children.push(newChild);
        },

        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
        },

    }
};