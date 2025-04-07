import { ElMessage, ElMessageBox } from 'element-plus'
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
            ElMessage.error('解析 JSON 文件时出错！')
            resolve(null)
          }
        }
        reader.onerror = () => {
          ElMessage.error('读取文件时出错！')
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

export function shotElement(
  cssPath: string,
  method: 'download' | 'copy' = 'download',
  callbackFn?: Function,
) {
  html2canvas(document.querySelector(cssPath)!, { scale: 3 }).then(async (canvas) => {
    const screenshotContainer = document.getElementById('screenshot-container')!
    screenshotContainer.innerHTML = ''
    screenshotContainer.appendChild(canvas)

    switch (method) {
      case 'download':
        downloadInBrowser(canvas.toDataURL('image/png'), `日志快照-${Date.now()}.png`)
        await new Promise((res) => setTimeout(res, 1000))
        ElMessage.success('已下载到本地磁盘！')
        break
      case 'copy':
        try {
          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((blob) => {
              resolve(blob)
            }, 'image/png')
          })

          if (blob) {
            const item = new ClipboardItem({ 'image/png': blob })
            await navigator.clipboard.write([item])
            ElMessage.success('已复制到剪切板！')
          }
        } catch (error) {
          ElMessage.error('复制失败！您可能正在使用不安全的通讯，或拒绝了权限申请。')
          if (window.location.href.startsWith('http://')) {
            ElMessageBox.alert(
              `<p>Chrome/Edge 认为 http 网站不安全，会限制其权限，包括剪切板权限。</p>
             <p>打开 <a href="chrome://flags/">chrome://flags/</a>，查找 #unsafely-treat-insecure-origin-as-secure，启用并填入 <a href="${window.location.href}">${window.location.href}</a>，按要求重启浏览器后，本页面就能正常使用剪切板了。</p>`,
              '您的剪切板不能使用！',
              {
                dangerouslyUseHTMLString: true,
              },
            )
          }
        }
        break
    }

    callbackFn?.apply(undefined)
  })
}
