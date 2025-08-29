import { useMessage } from '@/stores/messages'
import type { Log } from '@/types'
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

export function copyAsText(log: Log) {
  // 创建进度条文本
  const createProgressBar = (progress: number): string => {
    const value = Math.max(0, Math.min(100, progress))
    const barLength = 20
    const filledLength = Math.round((value / 100) * barLength)
    const filled = '█'.repeat(filledLength)
    const empty = '░'.repeat(barLength - filledLength)
    return `${filled}${empty} ${value}%`
  }

  // 构建项目日志部分
  const projectSection = ['📋 项目日志:']
  if (log.projects.length === 0) {
    projectSection.push('  无项目记录')
  } else {
    log.projects.forEach((project) => {
      // 异常状态标识
      const exception = project.exception
        ? project.exception === 'failed'
          ? '❌ 失败'
          : '⏸️ 搁置'
        : ''

      // 今日进展标识
      const progressFlag = project.makeProgress ? '⬆️' : ''

      // 项目标题行
      projectSection.push(`  📁 ${project.project} ${exception} ${progressFlag}`)
      projectSection.push(`    组织: ${project.org}`)
      projectSection.push(`    进度: ${createProgressBar(project.progress)}`)
      projectSection.push('') // 空行分隔
    })
  }

  // 构建事件日志部分
  const eventSection = ['📝 事件日志:']
  if (log.events.length === 0) {
    eventSection.push('  无事件记录')
  } else {
    log.events.forEach((event) => {
      // 事件状态标识
      let stateIcon = ''
      switch (event.state) {
        case 'on':
          stateIcon = '🚀 推进中'
          break
        case 'blocked':
          stateIcon = '🚧 受阻'
          break
        case 'ok':
          stateIcon = '✅ 已完成'
          break
      }
      eventSection.push(`  ${stateIcon}: ${event.body}`)
    })
  }

  // 组合所有部分并返回
  copyToClipboard([...projectSection, '', ...eventSection].join('\n'))
}
