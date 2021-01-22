const Mock = require('mockjs');
//格式： Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/getClassInfo', 'post', require('./json/getClassInfo'));
Mock.mock('/getLableInfoByClassId', 'post', require('./json/getLableInfoByClassId'));
Mock.mock('/getLableInfoByLableName', 'post', require('./json/getLableInfoByLableName'));
Mock.mock('/getGroupInfo', 'post', require('./json/getGroupInfo'));