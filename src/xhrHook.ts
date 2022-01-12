export default {
  init: (initFn: Function) => {
    const xhr: any = window.XMLHttpRequest
    if (xhr._eagle_monitor === true) {
      return void 0
    }
    xhr._eagle_monitor = true

    const _originOpen = xhr.prototype.open
    xhr.prototype.open = function (
      method: string,
      url: string,
      async: any,
      user: string | number,
      password: string | number
    ) {
      this._eagle_xhr_info = {
        method, url, async, user, password, status: null
      }
      
      return _originOpen.apply(this, arguments)
    }

    const _originSend = xhr.prototype.send
    xhr.prototype.send = function () {
      this._eagle_start_time = Date.now()

      const ajaxEnd = (event: any) => () => {
        if (this.response) {
          let responseSize = null
          switch (this.responseType) {
            case 'json':
              responseSize = JSON && JSON.stringify(this.response).length;
              break;
            case 'blob':
            case 'moz-blob':
              responseSize = this.response.size;
              break;
            case 'arraybuffer':
              responseSize = this.response.byteLength;
            case 'document':
              responseSize = this.response.documentElement && this.response.documentElement.innerHTML && (this.response.documentElement.innerHTML.length + 28);
              break;
            default:
              responseSize = this.response.length;
          }
          this._eagle_xhr_info.event = event
          this._eagle_xhr_info.status = this.status
          this._eagle_xhr_info.success = this.status === 200
          this._eagle_xhr_info.duration = Date.now() - this._eagle_start_time
          this._eagle_xhr_info.responseSize = responseSize
          // this._eagle_xhr_info.requestSize = value ? value.length : 0
          this._eagle_xhr_info.type = 'xhr'
          initFn(this._eagle_xhr_info)
        }
      }

      this.addEventListener('load', ajaxEnd('load'), false)
      this.addEventListener('error', ajaxEnd('error'), false)
      this.addEventListener('abort', ajaxEnd('abort'), false)

      return _originSend.apply(this, arguments)
    }

    if (window.fetch) {
      const _origin_fetch = window.fetch

      window.fetch = function () {
        const startTime = Date.now()
        const args: any = [].slice.call(arguments)

        let method = 'GET'
        let url = null

        const fetchInput: any = args[0]
        if (typeof fetchInput === 'string') {
          url = fetchInput
        } else if ('Request' in window && fetchInput instanceof window.Request) {
          url = fetchInput.url
          method = fetchInput.method || method
        } else {
          url = `${fetchInput}`
        }

        const eagleFetchData: any = {
          method, url, status: null
        }

        return _origin_fetch.apply(this, args).then(function (response) {
          eagleFetchData.status = response.status
          eagleFetchData.type = 'fetch'
          eagleFetchData.duration = Date.now() - startTime

          initFn(eagleFetchData)
          return response
        })
      }
    }
  }
}