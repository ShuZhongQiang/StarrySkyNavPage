let leftIcon = document.getElementsByClassName('left-icon-style')[0]
let rightIcon = document.getElementsByClassName('right-icon-style')[0]
let bookmarkMenuBoxBlock = document.getElementsByClassName('bookmark-menu-box-block')
let bookmarkMenu = document.getElementsByClassName('bookmark-menu')[0]
let bookmarkMenuBox = document.getElementsByClassName('bookmark-menu-box')[0]
// 当前页面
let currentPage = 'page1'
// 偏移量
let offset = 0
//初始化函数
function init() {
  // 把bookmarkMenuBoxBlockDom对象转成数组
  let bookmarkMenuBoxBlockDom = Array.from(bookmarkMenuBoxBlock)
  bookmarkMenuBoxBlockDom.forEach(item => {
    item.style.width = `${bookmarkMenu.offsetWidth - 10}px`
    item.style.padding = '0 5px'
  });
  readBookmark();
}
init();
// 监听.right-icon-style点击事件
rightIcon.addEventListener('click', function() {
  toggleBookmarkMenuBox('right')
});
leftIcon.addEventListener('click', function() {
  toggleBookmarkMenuBox('left')
});
// 切换div
function toggleBookmarkMenuBox(direction) {
  let bookmarkMenuBox = document.getElementsByClassName('bookmark-menu-box')[0]
  if (direction === 'right') {
    if(Math.abs(offset) >= bookmarkMenuBox.offsetWidth - bookmarkMenu.offsetWidth){
      offset = offset
      // rightIcon.style.display = 'none'
    }else{
      leftIcon.style.display = 'block'
      offset -= bookmarkMenu.offsetWidth
      Math.abs(offset) >= bookmarkMenuBox.offsetWidth - bookmarkMenu.offsetWidth ? rightIcon.style.display = 'none' : rightIcon.style.display = 'block'
       // 过渡动画
      bookmarkMenuBox.style.transition = 'all 0.5s'
      bookmarkMenuBox.style.transform = `translateX(${offset}px)`
    }
  } else {
    if(offset >= 0){
      offset = 0
      // leftIcon.style.display = 'none'
    }
    else{
      rightIcon.style.display = 'block'
      offset += bookmarkMenu.offsetWidth
      offset >= 0 ? leftIcon.style.display = 'none' : leftIcon.style.display = 'block'
      // 过渡动画
      bookmarkMenuBox.style.transition = 'all 0.5s'
      bookmarkMenuBox.style.transform = `translateX(${offset}px)`
    }
  }

}

// 读取staic/bookmark.json文件
function readBookmark() {
  fetch('./static/bookmark.json').then(res => {
    res.json().then(data => {
      // console.log(data)
      // 渲染书签
      renderWebDevelopBookmark(data)
    });
  });
}

// 前端书签渲染
function renderWebDevelopBookmark(data) {
  // 获取嵌套对象数组name为’在线教程和文档‘的数据’
  let res = []
  function deepTraverse(data, name) {
    data.forEach(item => {
      if (item.name === name) {
        res.push(item)
      }
      if (item.children) {
        deepTraverse(item.children, name)
      }
    });
    return res
  }
  let webDevelopBookmark = deepTraverse(data, '在线教程和文档')
  webDevelopBookmark[0].children.forEach(item => {
    let bookmarkDom = document.querySelectorAll('.develop-document ul')[0];
    isExist(item.icon).then(res => {
      bookmarkDom.innerHTML += `<li>
      <img src="${item.icon}" />
      <a href="${item.href}">${item.name}</a>
      </li>`
    }).catch(err => {
      bookmarkDom.innerHTML += `<li>
      <img src="https://bu.dusays.com/2022/07/30/62e4dea5ec9c3.jpg" />
      <a href="${item.href}">${item.name}</a>
      </li>`
    })


    // CheckImgExists(item.icon).then(data=>{
    //   bookmarkDom.innerHTML += `<li>
    //   <img src="${item.icon}" />
    //   <a href="${item.href}">${item.name}</a>
    //   </li>`
    // }).catch(err => {
    //   bookmarkDom.innerHTML += `<li>
    //   <img src="https://bu.dusays.com/2022/07/30/62e4dea5ec9c3.jpg" />
    //   <a href="${item.href}">${item.name}</a>
    //   </li>`
    // })
    /// console.log(flag)
  });
}

// 验证图片是否加载成功函数 
function isExist(path) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.src = path
    img.onload = function() {
      resolve(true)
    }
    img.onerror = function() {
      reject(false)
    }
  })
}
