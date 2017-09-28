import Api from './api'

/**
 * Isomorphic Http Promise Requests Class
 */
export default class Http {

  /**
   * Request
   * @param   {String}  method
   * @param   {String}  url
   * @param   {Object}  [data]
   * @param   {Object}  options
   * @return  {Promise}
   */
  static request(method, url, data, options = {}) {
    const requestOnce = (method, url, data) => {
      if (typeof window !== 'undefined' && window.XMLHttpRequest) {
        return Http.xmlHttpRequest(method, url, data)
      }
      return Http.requestPromise(method, url, data)
    }

    if (options.retry != null) {
      const requestOnceRetry =
        numberOfRetries => {
          return requestOnce(method, url, data)
            .catch(err => {
              if (err.code !== 'ETIMEDOUT' || numberOfRetries === options.retry) {
                throw err
              }

              const exponentialBackoffDelay = (Math.pow(2, numberOfRetries) * 500) + Math.floor(Math.random() * 500);

              return new Promise((resolve, reject) => {
                setTimeout(resolve, exponentialBackoffDelay);
              })
                .then(() => requestOnceRetry(numberOfRetries + 1));
            })
        }

      return requestOnceRetry(0)
    } else {
      return requestOnce(method, url, data)
    }
  }

  /**
   * XmlHttpRequest request
   * @param   {String}  method
   * @param   {String}  url
   * @param   {Object}  [data]
   * @return  {Promise}
   */
  static xmlHttpRequest(method, url, data) {
    return new Promise((resolve, reject) => {
      const request = new window.XMLHttpRequest()
      request.open(method, url)
      request.onload = function () {
        try {
          const response = JSON.parse(request.response)

          if (request.status === 200) {
            resolve(response)
          } else {
            reject({
              body: response,
              status: request.status
            })
          }
        } catch (e) {
          reject({
            body: request.responseText,
            status: request.status
          })
        }
      }
      request.onerror = function () {
        reject({
          body: {error: {message: 'An unknown error occurred during the request.'}},
          status: request.status
        })
      }
      request.setRequestHeader('Content-Type', 'application/json')
      request.setRequestHeader('Accept', 'application/json')
      request.send(JSON.stringify(data))
    })
  }

  /**
   * Request Promise
   * @param   {String}  method
   * @param   {String}  url
   * @param   {Object}  [data]
   * @return  {Promise}
   */
  static requestPromise(method, url, data) {
    const rp = require('request-promise')
    const options = {
      method: method,
      uri: url,
      json: true,
      headers: {'User-Agent': 'Facebook-JS-Ads-SDK/' + Api.VERSION}
    }
    if (data) {
      options.body = data
    }
    return rp(options).catch((response) => {
      response = {
        body: response.error ? response.error : response,
        status: response.statusCode
      }
      throw response
    })
  }

}
