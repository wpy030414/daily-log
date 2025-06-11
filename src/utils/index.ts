import { useMessage } from '@/stores/messages'
// import { useWidthRate } from '@/stores/width-rate'
import markdownit from 'markdown-it'
import markdownItTextualUml from 'markdown-it-textual-uml'
import markdownItKatex from '@iktakahiro/markdown-it-katex'
import { toBlob } from 'html-to-image'

export function downloadInBrowser(href: string, filename: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  link.click()
  link.remove()
  useMessage().success('已下载到本地磁盘！')
}

export function uploadInBrowser(isJSON: boolean = true) {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    if (isJSON) {
      input.accept = '.json'
    }

    const handleChange = (event: Event) => {
      const { files } = event.target as HTMLInputElement
      if (files && files.length > 0) {
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const result = e.target?.result as string
            resolve(isJSON ? JSON.parse(result) : result)
          } catch (error) {
            useMessage().error('解析 JSON 文件时出错！')
            resolve(null)
          }
        }
        reader.onerror = () => {
          useMessage().error('读取文件时出错！')
          resolve(null)
        }
        reader.readAsText(file)
      } else {
        resolve(null)
      }
    }

    input.addEventListener('change', handleChange)
    input.click()
  })
}

export async function copyToClipboard(data: string | Blob) {
  try {
    if (typeof data === 'string') {
      await navigator.clipboard.writeText(data)
    } else if (data instanceof Blob) {
      await navigator.clipboard.write([new ClipboardItem({ [data.type]: data })])
    }
    useMessage().success('已复制到剪切板！')
  } catch (e) {
    if (e instanceof Error) {
      const errorMessages = {
        NotAllowedError: '您拒绝了授权！',
        SecurityError: '您正在使用非安全上下文，不能使用剪切板！',
        default: '发生了未知错误！',
      }
      const message = errorMessages[e.name as keyof typeof errorMessages] || errorMessages.default
      useMessage().error(message)
      throw new Error(e.message)
    }
  }
}

export async function shotElement(cssPath: string, method: 'download' | 'copy' = 'download') {
  // if (useWidthRate().value > 0.33) {
  //   useMessage().warning('请您先最窄化窗口再操作！')
  //   return
  // }

  await new Promise((res) => setTimeout(res, 1000))

  const blob = await toBlob(document.querySelector(cssPath) as HTMLElement, { pixelRatio: 3 })

  if (!blob) {
    useMessage().error('无法生成快照，请检查选择器是否正确！')
    return
  }

  switch (method) {
    case 'download':
      downloadInBrowser(URL.createObjectURL(blob), `工作日报快照-${Date.now()}.png`)
      break
    case 'copy':
      copyToClipboard(blob)
      break
  }
}

export function markdownToHtml(str: string) {
  return markdownit().use(markdownItTextualUml).use(markdownItKatex).render(str)
}

export const draggable = {
  mounted(
    el: {
      querySelector: (arg0: any) => any
      offsetLeft: any
      offsetTop: any
      style: { cursor: string; userSelect: string; left: string; top: string; position: string }
      __draggable?: { destroy: () => void }
    },
    binding: { value: boolean; arg: any },
  ) {
    if (binding.value !== false) {
      let startX: number, startY: number, initialX: number, initialY: number
      let isDragging = false

      const dragHandle = binding.arg ? el.querySelector(binding.arg) : el

      const handleMouseDown = (e: { target: { tagName: string }; clientX: any; clientY: any }) => {
        if (e.target.tagName === 'BUTTON') return

        isDragging = true

        initialX = el.offsetLeft
        initialY = el.offsetTop
        startX = e.clientX
        startY = e.clientY

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        el.style.cursor = 'grabbing'
        el.style.userSelect = 'none'
      }

      const handleMouseMove = (e: { clientX: number; clientY: number }) => {
        if (!isDragging) return

        const dx = e.clientX - startX
        const dy = e.clientY - startY

        el.style.left = `${initialX + dx}px`
        el.style.top = `${initialY + dy}px`
      }

      const handleMouseUp = () => {
        isDragging = false

        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)

        el.style.cursor = 'grab'
        el.style.userSelect = ''
      }

      dragHandle.addEventListener('mousedown', handleMouseDown)

      el.__draggable = {
        destroy: () => {
          dragHandle.removeEventListener('mousedown', handleMouseDown)
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        },
      }

      el.style.position = 'absolute'
      el.style.cursor = 'grab'
    }
  },

  unmounted(el: { __draggable?: { destroy: () => void } }) {
    if (el.__draggable) {
      el.__draggable.destroy()
      delete el.__draggable
    }
  },
}
