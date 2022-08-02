// canvas 星星动画 跟随鼠标移动
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// 获取可视区域宽高
var canvasWidth = canvas.width = document.getElementsByClassName('canvas-box')[0].clientWidth;
var canvasHeight = canvas.height = document.getElementsByClassName('canvas-box')[0].clientHeight;
// 星星
var stars = [];
// 流星
var meteors = [];
var mouseX = 0;
var mouseY = 0;
var canvasNowX = -10;
var canvasNowY = -10;
var canvasAll = [];

// 初始化星星数组
function initStars() {
  for (let i = 0; i < 500; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      radius: Math.random() * 1.5,
      color: '#fff'
    });
  }
}

// 初始化流星数组
function initMeteors() {
  for (let i = 0; i < 10; i++) {
    meteors.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      radius: Math.random() * 2,
      color: '#fff',
      flag: i % 2 ? true : false
    });
  }
}

// 绘制星星
function drawStars() {
  // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.globalCompositeOperation = 'destination-out';  // 在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // 背景透明度越低尾迹越长
  ctx.fillRect(0, 0, canvas.width, canvas.height); // 添加一个 和canvas 大小一样的矩形填充
  ctx.globalAlpha = 1;
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    ctx.beginPath();
    ctx.globalCompositeOperation = 'lighter'; // 显示源图像 + 目标图像
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 5, false);
    ctx.closePath();
    ctx.fill();
  }
}

// 星星闪烁
function starsTwinkle() {
  for (var i = 0; i < stars.length; i++) {
    let star = stars[i];
    star.radius = Math.abs(Math.random() * 1.5 - star.radius) > 0.2 ? star.radius : Math.random() * 1.5;
  }
}

// 绘制流星
function drawMeteors() {
  // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.globalCompositeOperation = 'destination-out';  // 在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // 背景透明度越低尾迹越长
  ctx.fillRect(0, 0, canvas.width, canvas.height); // 添加一个 和canvas 大小一样的矩形填充
  for (let i = 0; i < meteors.length; i++) {
    let meteor = meteors[i];
    ctx.beginPath();
    ctx.globalCompositeOperation = 'lighter'; // 显示源图像 + 目标图像
    ctx.arc(meteor.x, meteor.y, meteor.radius, 0, Math.PI * 5, false);
    ctx.closePath();
    ctx.fill();
  }
}

// 更新流星位置
function updateMeteors() {
  let speed = Math.random() * 5;
  for (let i = 0; i < meteors.length; i++) {
    let meteor = meteors[i];
    if (meteor.flag) {
      meteor.x += speed + 1;
      meteor.y += speed + 1;
    } else {
      meteor.x -= speed + 1;
      meteor.y += speed + 1;
    }
    if (meteor.x > canvasWidth || meteor.x < 0 || meteor.y > canvasHeight || meteor.y < 0) {
      meteors.splice(i, 1);
      meteors.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: Math.random() * 2,
        color: '#fff',
        flag: i % 2 ? true : false
      });
    }
  }
}
function canvasBegin(mouseX, mouseY) {
  var fillStyleR = Math.floor(Math.random() * 255);
  var fillStyleG = Math.floor(Math.random() * 255);
  var fillStyleB = Math.floor(Math.random() * 255);
  var fillStyle = 'rgb(' + fillStyleR + ',' + fillStyleG + ',' + fillStyleB + ')';
  var grd = ctx.createLinearGradient(mouseX - 25, mouseY - 25, mouseX + 25, mouseY + 25);
  var radius = Math.floor(18 + Math.random() * 4);
  canvasAll.push({
    x: mouseX,
    y: mouseY,
    radius: radius,
    fillStyle: fillStyle
  });
  grd.addColorStop(0, fillStyle);
  grd.addColorStop(1, "white");
  ctx.fillStyle = grd;
  ctx.beginPath();
  // ctx.globalCompositeOperation = 'destination-over';
  ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2, true);
  ctx.fill();
}
function canvasEnd(mouseX, mouseY) {
  setTimeout(function () {
    canvasAll.shift();
    let radius = 0;
    let timeEnd = setInterval(function () {
      ctx.fillStyle = 'rgb(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2, true);
      ctx.fill();
      radius += 2;
      if (radius == 24) {
        clearInterval(timeEnd);
      }
    }, 16)
  }, 1000)
}
// 鼠标移动尾迹特效
function mouseTrace(mouseX, mouseY) {
  if ((Math.abs(mouseX - canvasNowX) > 50) || (Math.abs(mouseY - canvasNowY) > 50)) {
    canvasNowX = mouseX;
    canvasNowY = mouseY;
    canvasBegin(mouseX, mouseY);
    canvasEnd(mouseX, mouseY);
  }
}
// 监听鼠标移动
canvas.addEventListener('mousemove', function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  mouseTrace(mouseX, mouseY);
}, false);

// 更新星星
function update() {
  drawStars();
  starsTwinkle();
  drawMeteors();
  updateMeteors();
  canvasAll.forEach(item => {
    ctx.beginPath();
    var grd = ctx.createLinearGradient(item.x - 12, item.y - 12, item.x + 12, item.y + 12);
    grd.addColorStop(0, item.fillStyle);
    // 添加紫色渐变
    grd.addColorStop(1, "rgba(32,0,255,0.3)");
    // ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = grd;
    ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2, true);
    ctx.fill();
  });
}
// 定时器
setInterval(update, 1200 / 60);

function jumpPage(searchValue) {
  if(searchValue){
      window.location.href = "http://www.baidu.com/s?ie=UTF-8&wd=" + searchValue;
  }
}
function toBaidu() {
  let searchValue = document.getElementById("searchInput").value;
  jumpPage(searchValue);
}
// 按Enter键,执行事件
function entersearch(event) {
  if (event.keyCode == 13) {
    toBaidu();
  }
}

//写一个时钟效果
function clock() {
  var date = new Date();
  var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  var time = hour + ":" + minute + ":" + second;
  document.getElementById("clock").innerHTML = time;
}
//设置一个定时器
setInterval(clock, 1000);

// 写一个日期效果
function date() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var week = date.getDay();
  var weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  var weekStr = weekArr[week];
  var dateStr = year + "年" + month + "月" + day + "日" + " " + weekStr;
  document.getElementById("date").innerHTML = dateStr;
}
//设置一个定时器
setInterval(date, 1000);
// 每日一句
function getOneSentence() {
  fetch("https://v1.hitokoto.cn/")
    .then(function (response) {
      return response.json();
    }
    ).then(function (data) {
      document.getElementById("sentence").innerHTML = data.hitokoto;
    }
    ).catch(function (error) {
      console.log(error);
    });
}
// 设置一个定时器
setInterval(getOneSentence, 60000);

// 获取当前城市 异步加载
async function getCity() {
  return new Promise(function (resolve, reject) {
    var myCity = new BMap.LocalCity();
    myCity.get(result => {
      resolve(result.name);
    });
  });
}

// 根据获取天气
function getWeather() {
  getCity().then(res => {
    let city = res;
    fetch(`https://api.seniverse.com/v3/weather/now.json?key=SwEgOejElCStyXhL7&location=${city}&language=zh-Hans&unit=c`)
    .then(function (response) {
      return response.json();
    }
    ).then(function (data) {
      document.getElementById("weather").innerHTML = `当前城市：${data.results[0].location.name}  ${data.results[0].now.text} ${data.results[0].now.temperature}℃`;
      let weatherIcon = document.getElementById("weather-icon");
      weatherIcon.classList.add('iconfont');
      // 判断天气
      if(data.results[0].now.text === '晴'){
        // weatherIcon添加一个class
        weatherIcon.classList.add('icon-qingtian');
      }
      if(data.results[0].now.text === '多云'){
        weatherIcon.classList.add('icon-duoyun');
      }
      if(data.results[0].now.text === '阴'){
        weatherIcon.classList.add('icon-tianqiyintian');
      }
      if(data.results[0].now.text === '小雨'){
        weatherIcon.classList.add('icon-xiaoyu');
      }
      if(data.result[0].now.text === '中雨'){
        weatherIcon.classList.add('icon-zhongyu');
      }
      if(data.results[0].now.text === '大雨'){
        weatherIcon.classList.add('icon-dayu');
      }
      if(data.results[0].now.text === '暴雨'){
        weatherIcon.classList.add('icon-dayu');
      }
      if(data.results[0].now.text === '雷雨'){
        weatherIcon.classList.add('icon-tianqi-leiyubingbao');
      }
    }
    ).catch(function (error) {
      console.log(error);
    });
  }).catch(err => {
    document.getElementById("weather").innerHTML = "获取城市失败";
  })
}
// 每日图片
function getOnePicture() {
  return new Promise(function (resolve, reject) {
    fetch("https://api.unsplash.com/photos/random?client_id=0_nqXCSYsQy_B56drhGc7oPN-2Dfgw2eUUmK_Tv25u4")
      .then(function (response) {
        return response.json();
      }
      ).then(function (data) {
        console.log(data);
        resolve(data.urls.regular);
      }
      ).catch(function (error) {
        console.log(error);
      });
  });
}
function drawOnePicture(){
  let pictureDomArr = document.getElementsByClassName("picture");
  let pictureList = [];
  if( JSON.parse(localStorage.getItem("pictureList")).length > 0 ){
    console.log(JSON.parse(localStorage.getItem("pictureList")).length);
    pictureList = JSON.parse(localStorage.getItem("pictureList"));
  }else{
    console.log(2)
    for(let i = 0; i < pictureDomArr.length; i++){
      getOnePicture().then(res => {
        pictureList.push(res);
        // 将pictureList存储到本地
        localStorage.setItem("pictureList", JSON.stringify(pictureList));
      }).catch(err => {
        console.log(err);
      })
    }
  }
  for(let i =0; i < pictureDomArr.length; i++){
    pictureDomArr[i].style.backgroundImage = `url(${pictureList[i]})`;
    pictureDomArr[i].style.backgroundSize = "cover";
  }
}
// 初始化函数
function init() {
  // 初始化
  initStars();
  // 随机创建流星
  initMeteors();
  getOneSentence();
  getWeather();
  drawOnePicture();
}
init();
