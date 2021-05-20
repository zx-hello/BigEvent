// 发送请求 获取用户信息   http://www.itcbc.com:8080/my/user/userinfo
axios.get('http://www.itcbc.com:8080/my/user/userinfo', {
  headers : {
    Authorization : localStorage.getItem('token')
  }
}).then(res => {
  // console.log(res)
  // 解构  看清楚结构！！！！ res.data.data
  let {nickname, user_pic, username} = res.data.data
  // 设置欢迎 名称  若用户有昵称就使用 没有就使用username
  let name = nickname || username
  $('.username').text(name)
  // 显示头像 新用户没有头像 使用name的第一个字符  当有头像时 使用头像图片
  if (user_pic) {
    // 说明有头像
    $('.layui-nav-img').attr('src', user_pic).show()
  } else {
    // 说明没有头像  截取字符串三种方式  substr substring splice
    // 截取第一个字符串当作头像  若是字母转成大写
    let first = name.substring(0, 1).toUpperCase()
    // 此处使用show()方法 会显示元素本身的display状态 所以不适合使用show()
    $('.user-avatar').text(first).css('display', 'inline-block')
  }
})