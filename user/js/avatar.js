// 找到图片
let image = $('#image')
// 剪裁的配置项
let option = {
  // 剪裁比例
  aspectRatio: 1,
  // 指定预览区
  preview: '.img-preview'
}
// 调用cropper方法 实现初始化
image.cropper(option)


// 点击上传 触发文件域的单击事件
$('#chooseFile').on('click', function () {
  $('#file').trigger('click')
})

// 选择图片 更换剪裁区域的图片
$('#file').on('change', function () {
  // 获取图片的url地址
  if (this.files.length > 0) {
    // 找到文件对象
    // console.dir(this)  // input#file 对象
    let fileObj = this.files[0]
    // 创建url
    let url = URL.createObjectURL(fileObj)
    // console.log(url)  // blob:http://127.0.0.1:5500/d6eba064-b9ab-4c96-8b43-f65db72070ad
    // image.attr('src', url)  行不通 但是图片已经出现
    // 可以先将剪裁框的图片去除 然后更换图片 之后立马将剪裁图片给加上
    // image.cropper('destroy').attr('src', url).cropper(option)
    // 插件内的更换图片的方法
    image.cropper('replace', url)
  }
})

// -----------上传图片
// 点击确定 --> 剪裁图片 --> 
$('#sure').on('click', function () {
  // 剪裁图片得到canvas
  let canvas = image.cropper('getCroppedCanvas', {width : 30, height : 30})
  // canvas有一套内置的API方法 属于JS原生语法
  // toDataURL('image/jpeg', 0.3) 内部的参数是指转成base64格式是jpeg格式
  // 只有jpeg格式  才可以指定图片质量(0.3)这个参数
  let base64 = canvas.toDataURL()
  // console.log(base64)
  // 并且要将base64进行编码
  axios.post('/my/user/avatar', `avatar=${encodeURIComponent(base64)}`).then(res => {
    // console.log(res)
    let {status, message} = res.data
    if (status === 0) {
      layer.msg(message)
      // 更换头像 就要更换欢迎语句那里的图片
      window.parent.getUserInfo()
    }
  })
})