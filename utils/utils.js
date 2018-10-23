//数据转化
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number*1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function encoding(text){
  return text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#40;/g, '(').replace(/&#41;/g, ')').replace(/&#39;/g, "'");  
}
function getUrlParam(name) {
  // 获取参数
  var url = window.location.search;
  // 正则筛选地址栏
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  // 匹配目标参数
  var result = url.substr(1).match(reg);
  //返回参数值
  return result ? decodeURIComponent(result[2]) : null;
}

/*
  计算时间几分钟前、几小时前、月日显示
*/
function timeAgo(timeStamp) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var now = new Date().getTime();
  var diffValue = now - parseInt(timeStamp+'000');
  var result = '';

  if(diffValue < 0){
    return ;
  }
  
  var minC = diffValue / minute;
  var hourC = diffValue / hour;

  if (minC >= 1 && minC <= 59) {
    result = " " + parseInt(minC) + "分钟前";
  } else if (hourC >= 1 && hourC <= 23){
    result = " " + parseInt(hourC) + "小时前";
  }else {
    result = formatTime((timeStamp + '').substring(0, 10), "M-D");
  }
  
  return result;
}

module.exports = {
  formatTime: formatTime,
  encoding: encoding,
  getUrlParam: getUrlParam,
  timeAgo: timeAgo
}
