/* eslint-disable */

/**
 * 适配云雀客户端的方法
 */

/** 判断是否为云雀客户端 */
export function isLarkClient () {
  return window.JSInteraction ? true : false
}

/** 最小化窗口 */
export function minimizeWindow () {
  if (isLarkClient()) {
    window.JSInteraction.min()
  }
}

/** 最大化窗口 */
export function maximizeWindow () {
  if (isLarkClient()) {
    window.JSInteraction.max()
  }
}

/**
 * 关闭窗口
 */
export function closeWindow () {
  if (isLarkClient()) {
    window.JSInteraction.min()
  }
}

/**
 * 判断是否最大化
 * 该方法仅在chrome浏览器上有效
 * @return Boolean
 */
export function isFullScreen () {
  let explorer = window.navigator.userAgent.toLowerCase()
  if (explorer.indexOf(chrome) > 0) {
    return window.outerHeight === screen.availHeight && window.outerWidth === screen.availWidth
  } else {
    // 非chrome浏览器，待处理
    return false
  }
}
