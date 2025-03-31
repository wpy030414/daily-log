export interface EventItem {
  /**
   * 状态
   *
   * ---
   *
   * 只能从离散范围内取值：worried（紧急）、non-worried（不太紧急）、confused（有疑惑）、ok（完成）。
   */

  state: 'worried' | 'non-worried' | 'confused' | 'ok'

  /**
   * 事件概要
   */
  body: string
}
