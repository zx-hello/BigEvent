// 公共js功能

// 全局配置请求根路径
axios.defaults.baseURL = 'http://www.itcbc.com:8080'

// -------请求拦截器
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 统一添加请求头
  // console.log(config)
  let url = config.url
  // 对于url进行判断 地址中有my才带请求头
  if (url.includes('/my/')) {
    config.headers.Authorization = localStorage.getItem('token')
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// -------响应拦截器  当身份认证失败需要跳转到登陆页面 
// 并且不允许直接强行登录index页面 必须通过登录才可以进入
axios.interceptors.response.use(
  function (response){
    // console.log(response)
    let {status, message} = response.data
    if (status === 1) layer.msg(message)
    return response
  },
  function (error) {
    // 错误的时候也可以拿到结果 是error.response
    // console.log(error.response)
    let {status, message} = error.response.data
    // 判断token过期或者错误
    if (status === 1 && message === '身份认证失败！') {
      localStorage.removeItem('token')
      location.href = './login.html'
    }
    layer.msg(message)
    return Promise.reject(error)
  }
)

