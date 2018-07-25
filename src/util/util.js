export function getButtonPower(buttonsObj,id) {//获取按钮权限
  /*
    参数说明:buttonsObj:存放按钮的集合
     id:需要获取按钮权限的元素id
  */
  const buttonsArr = [];
    if(buttonsObj.length > 0){
    for(var i = 0; i < buttonsObj.length; i++){
      if(buttonsObj[i].id == id){
        buttonsArr.push(buttonsObj[i].url);
        buttonsArr.push(buttonsObj[i].buttons);
        return buttonsArr;
      }
    }
  }
}
export  default {
  getButtonPower
}
