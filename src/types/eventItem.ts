export interface EventItem {
  /**
   * 状态
   *
   * ---
   *
   * 只能从离散范围内取值：on（推进）、blocked（阻塞）、ok（完成）。
   */

  state: 'on' | 'blocked' | 'ok'

  /**
   * 事件概要
   */
  body: string
}
