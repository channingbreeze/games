/*
 * @Author: MngYou
 * @Date: 2022-01-30 12:08:48
 * @LastEditTime: 2022-01-30 12:41:38
 * @FilePath: \iwm\plugs.js
 */
function fireKeyEvent(el, evtType, keyChar, keyCode) {//el: HTMLElement, evtType: string, keyChar: string, keyCode: number
    el.focus()
    const KeyboardEventInit = {key: keyChar, code: keyChar, location: 0, repeat: false,
      isComposing: false, bubbles: true, composed: true, charCode: keyCode, keyCode: keyCode}
    const evtObj = new KeyboardEvent(evtType, KeyboardEventInit)// evtObj: any 
    evtObj.stop = evtObj.stopPropagation
    el.dispatchEvent(evtObj)
  }