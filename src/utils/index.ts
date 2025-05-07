import { useMessage } from '@/stores/messages'
import html2canvas from 'html2canvas'

export function downloadInBrowser(href: string, filename: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  link.click()
  link.remove()
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
            // ElMessage.error('解析 JSON 文件时出错！')
            resolve(null)
          }
        }
        reader.onerror = () => {
          // ElMessage.error('读取文件时出错！')
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

export function shotElement(cssPath: string, method: 'download' | 'copy' = 'download') {
  html2canvas(document.querySelector(cssPath)!, { scale: 3 }).then(async (canvas) => {
    const screenshotContainer = document.getElementById('screenshot-container')!
    screenshotContainer.innerHTML = ''
    screenshotContainer.appendChild(canvas)

    switch (method) {
      case 'download':
        downloadInBrowser(canvas.toDataURL('image/png'), `日志快照-${Date.now()}.png`)
        await new Promise((res) => setTimeout(res, 1000))
        useMessage().success('已下载到本地磁盘！')
        break
      case 'copy':
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((blob) => resolve(blob), 'image/png'),
        )

        if (blob) {
          await copyToClipboard(blob)
        }
        break
    }
  })
}
