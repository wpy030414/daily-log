import { ElMessage } from 'element-plus'
import html2canvas from 'html2canvas'

export function shotElement(
  cssPath: string,
  method: 'download' | 'copy' = 'download',
  callbackFn?: Function,
) {
  html2canvas(document.querySelector(cssPath)!, { scale: 3 }).then(async (canvas) => {
    const screenshotContainer = document.getElementById('screenshotContainer')!
    screenshotContainer.innerHTML = ''
    screenshotContainer.appendChild(canvas)

    switch (method) {
      case 'download':
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `日志快照-${Date.now()}.png`
        link.click()
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
            ElMessage.success('已粘贴到剪切板！')
          }
        } catch (error) {
          ElMessage.error('啊啊！你为什么不授权啊？笨蛋！')
        }
        break
    }

    callbackFn?.apply(undefined)
  })
}
