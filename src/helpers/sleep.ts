/** Sleep */
export const sleep = (waitTime: number) => new Promise((resolve) => setTimeout(resolve, waitTime))

/** 操作間隔 */
export const intervalOperation = (waitTime = 500) => sleep(waitTime)
