import dayjs, { extend } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

extend(utc)
extend(timezone)

/** 日本時間フォーマット */
export const dayformat = (date: Date, format?: 'jp-simple') => {
  switch (format) {
    case 'jp-simple':
      return dayjs(date).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')
  }
  return dayjs(date).tz('Asia/Tokyo').format()
}
