import axios from 'axios';
// 部署放开
// export const URLSERVER =  '.';
// 部署注释掉
export const URLSERVER = '/apis';
// mock模拟数据
// export const URLSERVER =  '';

// post请求带token
const axiosTokenPost = (url, params) => {
    return axios({
        method: 'post',
        headers: makeAuthHeader(),
        url: url,
        data: JSON.stringify(params),
    });
};
// get请求（有token）
const axiosTokenGet = (url, params) => {
    return axios({
        method: 'get',
        headers: makeAuthHeader(),
        url: url,
        params: params
    });
};
const makeAuthHeader = (isOnlyAuth) => {
    let tokenVal = JSON.parse(window.localStorage.getItem("token") || '[]');
    var ret = isOnlyAuth ? {
        "Accept": 'application/json',
        "Authorization": tokenVal

    } : {
        "Accept": 'application/json',
        "Content-Type": 'application/json',

        "Authorization": tokenVal

    };
    return ret;
};
const paramsCommon = {

};
// post请求(没有token)
const axiosPost = (url, params) => {
    return axios({
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        url: url,
        data: JSON.stringify(params),
    });
};
// get(没有token)
const axiosGet = (url, params) => {
    return axios({
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        url: url,
        params: params
    });
};


// 登录
export const LOGIN = URLSERVER + '/login';
export const CLASSDATAINFO = URLSERVER + '/getClassInfo';
export const GETLABLEINFO = URLSERVER + '/getLableInfoByClassId';
export const UPLOADFILE = URLSERVER + '/uploadFile';
export const GETLABLEINFOSEARCH = URLSERVER + '/getLableInfoByLableName';
// 数据表同步
export const DBSYNCHRONISM = URLSERVER + '/dbSynchronism';
// 获取模板名
export const GETANALYSISMODELNAME = URLSERVER + '/getAnalysisModelName';
// 通过模板id查询模板
export const QUERYTEMPLATEBYID = URLSERVER + '/queryTemplateById';

// 删除客群
export const DELETEGROUP = URLSERVER + '/deleteGroup';
// 通过客群名查询客群
export const SEARCHGROUPBYNAME = URLSERVER + '/searchGroupByName';
// 通过客群ID 查询客群
export const SEARCHGROUPBYID = URLSERVER + '/searchGroupById';
// 上传
export const IMPORT_ROOT = URLSERVER + '/report';
// 通过标签ID获取标签选项 
export const GETLABLEOPTIONBYLABLEID = URLSERVER + '/getLableOptionByLableId';
export const GETCUSTOMERNUM = URLSERVER + '/getCustomerNum';
export const GETINDICATORS = URLSERVER + '/getIndicators';

export const GETALLGROUPINFO = URLSERVER + '/getAllGroupInfo';

export const TONGJIVISIBLESAVE = URLSERVER + '/tongjiVisibleSave';

export const GROUPANALYLISTMETHOD = URLSERVER + '/groupAnalyListMethod';
export const GETTONGJIWEIDU = URLSERVER + '/getTongJiWeiDu';
export const GETDIMINFO = URLSERVER + '/getDimInfo';
export const DUOWEIFENXIVISIBLESAVE = URLSERVER + '/duoWeiFenXiVisibleSave';
export const duoWeiFenXiVisibleSave = (params) => {
    return axiosPost(DUOWEIFENXIVISIBLESAVE, params)
};
export const getDimInfo = (params) => {
    return axiosPost(GETDIMINFO, params)
};
export const getTongJiWeiDu = (params) => {
    return axiosPost(GETTONGJIWEIDU, params)
};

export const groupAnalyListMethod = (params) => {
    return axiosPost(GROUPANALYLISTMETHOD, params)
};

export const tongjiVisibleSave = (params) => {
    return axiosPost(TONGJIVISIBLESAVE, params)
};
export const getAllGroupInfo = (params) => {
    return axiosPost(GETALLGROUPINFO, params)
};
export const getCustomerNum = (params) => {
    return axiosPost(GETCUSTOMERNUM, params)
};

export const login = (params) => {
    return axiosPost(LOGIN, params)
};
export const getIndicators = (params) => {
    return axiosPost(GETINDICATORS, params)
};
export const classDataInfo = (params) => {
    return axiosPost(CLASSDATAINFO, params)
};

export const getLableInfo = (params) => {
    return axiosPost(GETLABLEINFO, params)
};
// 数据表同步
export const dbSynchronism = (params) => {
    return axiosPost(DBSYNCHRONISM, params)
};
// 通过模板ID查询模板详情
export const queryTemplateById = (params) => {
    return axiosPost(QUERYTEMPLATEBYID, params)
};

export const getLableInfoByLableName = (params) => {
    return axiosPost(GETLABLEINFOSEARCH, params)
};
export const uploadFile = (params) => {
    return axiosPost(UPLOADFILE, params)
};
export const deleteGroup = (params) => {
    return axiosPost(DELETEGROUP, params)
};
export const searchGroupByName = (params) => {
    return axiosPost(SEARCHGROUPBYNAME, params)
};
export const searchGroupById = (params) => {
    return axiosPost(SEARCHGROUPBYID, params)
};
// 获取模板名
export const getAnalysisModelName = (params) => {
    return axiosPost(GETANALYSISMODELNAME, params)
};
// 通过标签ID获取标签选项 
export const getLableOptionByLableId = (params) => {
    return axiosPost(GETLABLEOPTIONBYLABLEID, params)
};