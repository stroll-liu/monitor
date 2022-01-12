const getIndex = (ele: any): string => {
  const children = [].slice.call(ele.parentNode.children).filter((node: any) => node.tagName === ele.tagName)
  let myIndex: string | number = ''

  children.forEach((item, index) => {
    if (ele === item) {
      myIndex = index
    }
  })
  myIndex = `[${myIndex+1}]`
  const tagName = ele.tagName.toLocaleLowerCase()
  const myLabel = `${tagName}${myIndex}`
  return myLabel
}

const getXpath = (ele: any): any => {
  let xpath = ''
  let currentEle = ele
  while (currentEle !== document.querySelector('body') && currentEle !== document.querySelector('html')) {
    if (xpath) {
      xpath = `/${getIndex(currentEle)}${xpath}`
    } else {
      xpath = `/${getIndex(currentEle)}`
    }
    currentEle = currentEle.parentNode
  }
  console.log(xpath)
  return currentEle
}

export default {
  init: (initFn: Function) => {
    document.addEventListener('click', (e: any) => {
      const target = e.target
      const myLabel = getXpath(target)
      initFn(myLabel)
    }, false)
  }
}