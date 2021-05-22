// tinymce_setup.js就是封装的这个富文本编辑器 直接调用就可以
initEditor()

// 页面处理 获取文章分类
axios.get('/my/category/list').then(res => {
  // console.log(res.data)
  let {status, data} = res.data
  if (status === 0) {
    let str = ''
    data.forEach(item => {
      str += `<option value="${item.id}">${item.name}</option>`
    });
    // $('#select').html(str)   // html()会覆盖select里面的所有代码
    $('.cate_id').append(str)  // append()是在后面追加 不会将最开始的给覆盖了
    // 有些时候，你的有些表单元素可能是动态插入的。
    // 这时 form 模块 的自动化渲染是会对其失效的。
    // 虽然我们没有双向绑定机制（因为我们叫经典模块化框架，偷笑.gif） 
    // 但没有关系，你只需要执行 form.render(type, filter); 方法即可。
    let form = layui.form
    form.render('select')
  }
})

// ----------初始化剪裁框
//  初始化图片裁剪器
let image = $('#image')
// 裁剪选项
let options = {
  aspectRatio: 400 / 280,
  preview: '.img-preview'
}
// 初始化裁剪区域
image.cropper(options)

// 点击选择封面  可以选择图片
$('button:contains("选择封面")').on('click', function () {
  $('#file').trigger('click');
});

// 图片切换的时候，更换剪裁区的图片
$('#file').on('change', function () {
  if (this.files.length > 0) {
    // 找到文件对象
    var fileObj = this.files[0];
    // 创建url
    var url = URL.createObjectURL(fileObj);
    // 更换图片
    image.cropper('replace', url);
  }
});

// ----------表单提交  收集数据
$('form').on('submit', function (e) {
  e.preventDefault()
  let fd = new FormData(this)
  // 遍历才可以得到fd里面的files
  // 修改content  富文本编辑器的值
  fd.set('content', tinyMCE.activeEditor.getContent())
  let canvas = image.cropper('getCroppedCanvas', {width : 400, height : 280})
  // canvas.toDataURL()
  canvas.toBlob(function (blob) {
    // blob对象 追加到fd中之后 就会转成文件对象
    fd.append('cover_img', blob)
    // // 遍历fd 查看获取的内容
    // fd.forEach((item, index) => {
    //   console.log(item, index)
    // })
    axios.post('/my/article/add', fd).then(res => {
      // console.log(res.data)
      let {status, message} = res.data
      if (status === 0) {
        layer.msg(message)
        location.href = './list.html'
      }
    })
  })
 
})