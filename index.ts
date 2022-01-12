import beh from './src/beh'
import errorCatch from './src/errorCatch'
import perf from './src/perf'
import resource from './src/resource'
import xhrHook from './src/xhrHook'

const behCB = beh.init // 行为监测

const errorCatchCB = errorCatch.init // 错误监测

const perfCB = perf.init // 页面监测

const resourceCB = resource.init // 资源监测

const xhrHookCB = xhrHook.init // 接口监测

export default {
  behCB, errorCatchCB, perfCB, resourceCB, xhrHookCB
}
