export default {
  init: (initFn: Function) => {

    let isDOMReady = false
    let isOnLoad = false
    const cycleTime = 10
    const Window: any = window || {}
    const Document: any = document || {}
    const performance: any = Window.performance || Window.mozPerformance || Window.msPerformance || Window.webkitPerformance

    const Util = {
      getPerfData: (p: any) => {
        const data = {
          // 网络建联
          prevPage: p.fetchStart - p.navigationStart, // 上一个页面的时间
          redirect: p.redirectEnd - p.redirectStart, // 重定向时间
          dns: p.domainLookupEnd - p.domainLookupStart, // DNS查找时间
          connect: p.connectEnd - p.connectStart, // TCP建联时间
          network: p.connectEnd - p.navigationStart, // 网络总耗时

          // 网络接受
          send: p.responseStart - p.requestStart, // 前端从发送到接收的时间
          receive: p.responseEnd - p.responseStart, // 接受数据用时
          request: p.responseEnd - p.requestStart, // 请求页面的总耗时 

          // 前端渲染
          dom: p.domComplete - p.domLoading, // dom解析时间
          loadEvent: p.loadEventEnd - p.loadEventStart, // loadEvent时间
          frontend: p.loadEventEnd - p.domLoading, // 前端总时间

          // 关键阶段
          load: p.loadEventEnd - p.navigationStart, // 页面完全加载时间 
          domReady: p.domContentLoadedEventStart - p.navigationStart, // DOM准备时间
          interactive: p.domInteractive - p.navigationStart, // 可操作时间
          ttfb: p.responseStart - p.navigationStart, // 首字节时间

          // 
        }
        return data
      },
      domReady: (fn: any) => {
        if (isDOMReady === true) {
          return void 0
        }
        let timer: any = null
        const runCheck = () => {
          if (performance.timing.domComplete) {
            clearTimeout(timer)
            fn()
            isDOMReady = true
            // 停止循环检测；运行fn
          } else {
            // 再去循环检测
            timer = setTimeout(runCheck, cycleTime)
          }
        }
        if (Document.readyStart === 'interactive') {
          fn()
          return void 0
        }

        document.addEventListener('DOMContentLoaded', () => {
          runCheck()
        }, false)
        
      },
      onLoad: (fn: any) => {
        if (isOnLoad === true) {
          return void 0
        }
        let timer: any = null
        const runCheck = () => {
          if (performance.timing.loadEventEnd) {
            clearTimeout(timer)
            fn()
            isOnLoad = true
            // 停止循环检测；运行fn
          } else {
            // 再去循环检测
            timer = setTimeout(runCheck, cycleTime)
          }
        }
        if (Document.readyStart === 'interactive') {
          fn()
          return void 0
        }

        Window.addEventListener('load', () => {
          runCheck()
        }, false)
      }
    }

    Util.domReady(() => {
      const perfData: any = Util.getPerfData(performance.timing)
      perfData.type = 'domReady'
      initFn(perfData)
    })

    Util.onLoad(() => {
      const perfData: any = Util.getPerfData(performance.timing)
      perfData.type = 'onLoad'
      initFn(perfData)
    })
  }
}
