import Vue from 'vue'
import axios from 'axios'
import { Message, Loading } from 'element-ui';
import qs from 'qs'
let axiosIns = axios.create({});
/*if (process.env.NODE_ENV == 'development') {
  axiosIns.defaults.baseURL =process.env.API_ROOT;
} else if (process.env.NODE_ENV == 'debug') {
  axiosIns.defaults.baseURL = process.env.API_ROOT;
} else if (process.env.NODE_ENV == 'production') {
  axiosIns.defaults.baseURL = process.env.API_ROOT;
}*/
let loading        //定义loading变量

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoading() {    //使用Element loading-close 方法
  loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
axiosIns.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.responseType = 'json';
//对发送的数据进行数据序列化,适用于post/put/patch
axiosIns.defaults.transformRequest = [function (data) {
 return JSON.stringify(data);
 }
 ];
/*axiosIns.defaults.validateStatus = function (status) {
  return true;
};*/
//添加请求拦截器
axiosIns.interceptors.request.use(function (config) {
  //配置config
  config.headers.Accept = '* ';
  config.headers['Content-Type'] = 'application/json;charset=UTF-8;';
  if(config['Page-Number'] != undefined){//分页列表需要的参数
    config.headers['Page-Number'] = config['Page-Number'];
    config.headers['Page-Size'] = config['Page-Size'];
    config.headers['OrderBy'] = config['OrderBy'];
    config.headers['Dir'] = config['Dir'];
  }
  // let token = Vue.localStorage.get('token');
  // if(token){
  //     config.headers.Token = token;
  // }
  showFullScreenLoading();
  return config;
});
//添加一个响应拦截器
axiosIns.interceptors.response.use(function (response){

  //获取分页数据
  if(response.headers != undefined){
    let pageCount = response.headers['page-count'];
    if(pageCount != undefined){
      sessionStorage.setItem('pageCount',pageCount);
    }
  }

  tryHideFullScreenLoading();
  //判断异常数据
  let code = response.data.code;
  if(code == 100000){
    return response.data.body;
  }else if(code == 100001){
    this.$message('服务器运行异常');
  }else if(code == 100002){
    this.$message('没有访问资源的权限');
  }else if(code == 100003){
    this.$message('没有找到资源');
  }else if(code == 100004){
    this.$message('请求异常');
  }

}, function (error){
  // 处理响应失败
  return Promise.reject(error);
});

let ajaxMethod = ['get', 'post','put','delete'];
let api = {};
ajaxMethod.forEach((method)=> {
  //数组取值的两种方式
  api[method] = function (uri, data, config) {
    /*
      参数说明:url:请求地址
      data:请求参数
      config:请求拦截器配置(暂时用于配置header分页和header基础参数)
    */
    return new Promise(function (resolve, reject) {
      axiosIns[method](uri, data, config).then((response)=> {
        resolve(response);
      }).catch((response)=> {
          reject(response)
      })
    })
  }
});

Vue.prototype.$axios = api;

export default{

}
