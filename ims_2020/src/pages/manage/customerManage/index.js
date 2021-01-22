import  axios  from  'axios'
import * as Api from '../../../api/ManageApi';
import analysisDetails from '../customerAnalysis/analysisDetails/AnalysisDetails.vue';

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
            uploadingGroupVisible: false,
            tableConfig: [
                { label: 'ID', prop: 'custGrpId', },
                { label: '客群名称', prop: 'custGrpName', },
                { label: '规模', prop: 'custGrpScope', },
                {
                    label: '客群来源',
                    prop: 'custGrpSource',
                    formatter: function(row, column) {
                        var v = row[column.property];
                        var val = '';
                        switch (v) {
                            case '1':
                                val = '筛选条件';
                                break;
                            case '2':
                                val = '客群交并';
                                break;
                            case '3':
                                val = '客群上传';
                                break;
                            default:
                        }
                        return val;
                    }
                },
                { label: '创建者', prop: 'lastModifier', },
                { label: '最近数据更新时间', prop: 'lastModifyDate', },
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
                { label: '操作', operations: 'operations', updateIcon: false, width: 300 },

            ],
            tableData: [],
            inputSearch: '',
            // 客群应用
            useGroupVisible: false,
            useGroupTabsModel: 'first',
            synchronizeToPushOne: 'synchronizePush',
            synchronizeToPushTwo: 'synchronizePushTwo',
            synchronizeGroupNameOne: '',
            synchronizeGroupNameTwo: '',
            dateOfExpiryModel: '',
            autoUpdate: '',
            // 上传客群
            fileList: [],
            // 本地文件上传
            RadioUploadingGroup: 'localFileUploading',
            showLocalFileUpload: true,
            showDSUploadingDiv: false,
            file: {},
            // 上传客群时输入的客群名称
            inputGroupName: '',
            sourcename: '',
            idname: '',
            screeningCriteria: '',

            mergeGroupVisible: false,
            mergingRelation: 1,
            inputNewGroupNameOldOne: '',
            inputNewGroupNameOldTwo: '',
            inputNewGroupNameNew: '',
            // 客群合并
            restaurants: [],
            state: '',
            timeout: null,
            // 客群分析
            analysisDetailsVisible: false,
            // 更新的icon
            updateICON: 'el-icon-refresh-right',
            importForm: {},
            fileList: [],

            // 下载文件
            content: '',

        };
    },
    computed:  {
        uploadUrl()  {       return  Api.IMPORT_ROOT     },
    },
    mounted: function() {
        this.searchGroupByName();
        this.restaurants = this.loadAll();
    },
    methods: {
        // pageSize 改变时会触发（每頁条数）
        handleSizeChange(val) {
            this.pageSize = val;
            this.searchGroupByName();
        },
        // 当前页数
        handleCurrentChange(val) {
            this.pageNow = val;
            this.searchGroupByName();
        },
        // 搜索客群
        searchGroupByName() {
            let params = {
                REQ_HEAD: {
                    TransServiceCode: 'searchGroupByName',
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
                        this.tableData = res.data.lableInfo;
                        this.roleTotal = res.data.count;
                    }
                }
            })
        },
        // 应用
        useGroup(index, row) {
            // console.log(index, row)
            this.useGroupVisible = true;
        },
        // 修改客群信息
        updateGroupInfo(index, row) {
            console.log(row[index].custGrpSource);
            var custGrpSource = row[index].custGrpSource;
            if (custGrpSource == '1') { // 条件筛选

            } else if (custGrpSource == '2') { // 客群交并
                this.mergeGroupVisible = true;
            } else if (custGrpSource == '3') { // 客群上传
                this.uploadingGroupVisible = true;
            }
        },
        useGroupTabsClick(tab, event) {
            // console.log(tab, event);
        },
        useGroupSave() {

            axios.post('/rest/inventory/oh_status/info/excel', {
                site: this.selectedsite,
                bu: this.selectedbu,
                ohHealthStatus: this.selectedtitle,
                ohHealthRootcause: this.selectedblock,
                search: this.search,
                sort: this.sort
            }, { responseType: 'arraybuffer' }).then(this.ExportFile).catch(function(error) {
                console.log(error)
            })

            this.content = ['11111', '22\n22']
            this.filename = 'a.txt'
            const blob = new Blob([this.content])
            if (window.navigator.msSaveOrOpenBlob) {
                // 兼容IE10
                navigator.msSaveBlob(blob, this.filename)
            } else {
                //  chrome/firefox
                let aTag = document.createElement('a')
                aTag.download = this.filename
                aTag.href = URL.createObjectURL(blob)
                aTag.click()
                URL.revokeObjectURL(aTag.href)
            }


            this.$message({
                type: 'success',
                message: '应用成功!',
                offset: 100,
            });
            setTimeout(() => {
                this.useGroupVisible = false;
            }, 1500);
        },
        // 上传客群
        uploadingGroupClick() {
            this.uploadingGroupVisible = true;
        },
        // 删除客群
        deletGroup(index, row) {
            this.$confirm('此操作将永久删除该客群, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                let params = {
                    REQ_HEAD: {
                        TransServiceCode: 'deleteGroup',
                        userId: '',
                        branchId: '',
                        pageNo: 1,
                    },
                    BEQ_BODY: {
                        deleteId: row[index].custGrpId,
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
        // 上传客群
        handleRemove(file, fileList) {},
        handlePreview(file) {

        },
        getFile(teim) {
            this.file = teim.file;
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        uploadChange(file,  fileList)  {      
            this.fileList  =  fileList;
            //       if (fileList.length > 1) {
            //         fileList.shift()
            //       }
                
        },
        uploadList(response,  file,  fileList)  {      
            if  (response.ret  ===  0)  {
                this.message({
                    type:   'success',
                    text:   '操作成功',
                    offset: 100,
                })
            } else  {        
                this.message({
                    type:   'error',
                    text:  response.msg,
                    offset: 100,
                })
                this.fileList  =   []
            }    
        },
        uploadFile() {
            this.$refs['importForm'].validate((valid)  =>  {
                if  (valid)  {
                    let  formData  =  new  FormData();
                    formData.append('files',  this.fileList[0]);
                    formData.append('inputGroupName',  this.inputGroupName);
                    formData.inputGroupName =  this.inputGroupName;
                    let  config  =   {             headers:  {               'Content-Type':   'multipart/form-data',              }           };
                    axios.post(Api.IMPORT_ROOT,  formData,  config).then((res)  =>  {
                        if (res.status == '200') {
                            if (this.RadioUploadingGroup == 'localFileUploading') {
                                this.$message({
                                    type: 'success',
                                    message: '上传成功!',
                                    offset: 100,
                                });
                            } else if (this.RadioUploadingGroup == 'DSUploading') {
                                this.$message({
                                    type: 'success',
                                    message: '同步成功!',
                                    offset: 100,
                                });
                            }

                            setTimeout(() => {
                                this.uploadingGroupVisible = false;
                            }, 1500);
                        }
                    })
                }
            })

            //this.$refs.upload.submit()
            // let params = {
            //     REQ_HEAD: {
            //         TransServiceCode: 'uploadFile',
            //         userId: '',
            //         branchId: '',
            //         pageNo: 1,
            //     },
            //     BEQ_BODY: {
            //         fileData: this.file,
            //     }
            // }
            // Api.uploadFile(params).then((res) => {
            //     if (res.status == 200) {
            //         if (res.data.respCode == 0) {
            //             this.$message({
            //                 type: 'success',
            //                 message: '上传成功!'
            //             });
            //         }
            //     }
            // })
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleRemove(file, fileList) {
            this.fileList  =  fileList;
        },
        // 客群并交
        mergeGroupClick() {
            this.mergeGroupVisible = true;
        },
        jiaoBingSave() {
            setTimeout(() => {
                this.$message({
                    type: 'success',
                    message: '交并成功!',
                    offset: 100,
                });
                this.mergeGroupVisible = false;
            }, 500);
            setTimeout(() => {
                this.mergeGroupVisible = false;
            }, 1000);
        },
        loadAll() {
            return [
                { 'value': '定存优惠客群', 'address': '1' },
                { 'value': '活期优惠客群', 'address': '2' },
                { 'value': '新旺角茶餐厅', 'address': '3' },
                { 'value': '借贷预放款客群', 'address': '4' },
                { 'value': '借贷放款客群', 'address': '5' },
                { 'value': '信用卡客群', 'address': '6' },
                { 'value': '基金客群', 'address': '7' },
                { 'value': '沙和尚客群', 'address': '8' },
                { 'value': '孙悟空客群', 'address': '9' },
                { 'value': '猪八戒客群', 'address': '10' },
                { 'value': '唐僧客群', 'address': '11' },
                { 'value': '如来客群', 'address': '12' },
                { 'value': '米老鼠客群', 'address': '13' }
            ];
        },
        querySearchAsync(queryString, cb) {
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

        },

        // 客群分析
        groupAnalysis(index, row) {
            //console.log(row[index].custGrpId)
            this.analysisDetailsVisible = true;
            this.$nextTick(() => {
                this.$refs.analysisDetails.init(row[index].custGrpId);
            })
        },
        // 更新客群
        updateGroup(row) {
            this.tableData.map(item => {
                if (item.custGrpId == row.custGrpId) {
                    this.$set(item, 'updateIcon', true)
                    setTimeout(() => {
                        this.$set(item, 'updateIcon', false)
                        this.updateMessage()
                    }, 2000);
                    return item
                }
            })
        },
        // 更新提示
        updateMessage() {
            this.$notify({
                title: '提示',
                message: '更新成功！',
                type: 'success',
                offset: 100
            });
        },


    },

};