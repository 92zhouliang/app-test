import axios from 'axios';
import {
  Indicator,
  Toast
} from 'mint-ui';

//基础通用配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL ='';

/** @param Indicator 请求loading层
 * @param Toast  消息提示
*/
//http request 拦截器
axios.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data);
    config.headers = {
      // 'X-Requested-With': 'XMLHttpRequest',
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
    }
    //token的设置，预先获取
    // if(token){
    //   config.params = {'token':token}
    // }
    if(config.showLoading){
      Indicator.open({
        text: '加载中......',
        spinnerType: 'snake'
    })
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//http response 拦截器
axios.interceptors.response.use(response => {
  Indicator.close();
  return response
}, error => {
  return Promise.resolve(error.response)
})

// axios.interceptors.response.use(
//   response => {
//     if(response.data.errCode ==2){
//       router.push({
//         path:"/login",
//         querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
//       })
//     }
//     return response;
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return Toast({
    message: response.data.Message,
    position: 'bottom'
});
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    Toast({
      message: res.data.Message,
      position: 'bottom'
  });
  }
  if (res.data && (!res.data.success)) {
    Toast({
      message: res.data.Message,
      position: 'bottom'
  });
  }
  return res
}
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url,params={},config={showLoading:true}){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    },config)
    .then(response => {
      return checkStatus(response)
    })
    .catch(err => {
      return checkCode(err)
    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url,data = {},config={showLoading:true}){
   return new Promise((resolve,reject) => {
     axios.post(url,data,config)
          .then(response => {
            return checkStatus(response)
          },err => {
            return checkCode(err)
          })
   })
 }

//  /**
//  * 封装patch请求
//  * @param url
//  * @param data
//  * @returns {Promise}
//  */

// export function patch(url,data = {}){
//   return new Promise((resolve,reject) => {
//     axios.patch(url,data)
//          .then(response => {
//            resolve(response.data);
//          },err => {
//            reject(err)
//          })
//   })
// }

//  /**
//  * 封装put请求
//  * @param url
//  * @param data
//  * @returns {Promise}
//  */

// export function put(url,data = {}){
//   return new Promise((resolve,reject) => {
//     axios.put(url,data)
//          .then(response => {
//            resolve(response.data);
//          },err => {
//            reject(err)
//          })
//   })
// }