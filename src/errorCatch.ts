const formatError = (errorObj: any) => {
  const windowObj: any = window || {}
  const col: number | string = windowObj.column || windowObj.colNumber
  const row: number | string = windowObj.line || windowObj.lineNumber
  const name: string = errorObj.name
  const message: string = errorObj.message

  const { stack } = errorObj

  if (stack) {
    const matchUrl = stack.match(/[(http)(https)]?:\/\/[^\n]+/)
    const urlFirstSTack = matchUrl && matchUrl.length ? matchUrl[0]: ''
    const regUrlCheck = /[(http)(https)]?:\/\/(\S)*\.js/

    let resourceUrl = ''
    if (regUrlCheck.test(urlFirstSTack)) {
      resourceUrl = urlFirstSTack.match(regUrlCheck)[0]
    }

    let stackCol = null
    let stackRow = null
    const posStack = urlFirstSTack.match(/:(\d+):(\d+)/)
    if (posStack && posStack.length >= 3) {
      [, stackCol, stackRow] = posStack
    }
    return {
      content: stack,
      col: Number(col || stackCol),
      row: Number(row || stackRow),
      name, message, resourceUrl
    }
  }

  return {
    row, col, message, name
  }
}

export default {
  init: (initFn: Function) => {
    const _origin_error = window.onerror
    window.onerror = function(message, source, lineno, colno, error) {
      const errorInfo: any = formatError(error)
      errorInfo._message = message
      errorInfo._source = source
      errorInfo._lineno = lineno
      errorInfo._colno = colno
      errorInfo._error = error
      initFn(errorInfo, 'error')
      errorInfo.type = 'error'
      const args: any = arguments
      _origin_error && _origin_error.apply(window, args)
    }

    let _originOnunhandledrejection = window.onunhandledrejection
    window.onunhandledrejection = (...arg) => {
      let e = arg[0]
      let reason = e.reason
      initFn({
        type: e.type || 'unhandledrejection',
        reason
      }, 'unhandledrejection')
      _originOnunhandledrejection && _originOnunhandledrejection.apply(window, arg)
    }
  }
}