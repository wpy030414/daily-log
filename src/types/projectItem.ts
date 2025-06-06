export interface ProjectItem {
  /**
   * 异常
   *
   * ---
   *
   * 只能从离散范围内取值：failed（失败/放弃）、stucked（搁置/卡住/暂停）。
   *
   * 没有异常则无需填写。
   */
  exception?: 'failed' | 'stucked'

  /**
   * 所属组织
   */
  org: string

  /**
   * 项目名
   */
  project: string

  /**
   * 进度
   *
   * ---
   *
   * 只能从连续范围内取值：[0, 100]。
   */
  progress: number

  /**
   * 推进
   *
   * ---
   *
   * 当今日在此项目上付出时，值为真。
   */
  makeProgress?: boolean
}
