import { parseISO, formatDistanceToNow, formatDistanceToNowStrict, format } from 'date-fns'

const TimeAgo = ({ timestamp, dateFormat }) => {


    const date = parseISO(timestamp)
    const timePeriod = formatDistanceToNow(date)
    const formatted = format(date, 'dd/MM/yyyy hh:mm')
    const timeAgo = `${timePeriod} ago`

    const time = dateFormat === 'formatted' ? formatted : timeAgo

    return (
        <span title={timeAgo} className="post-time-ago">
            {time}
        </span>
    )
}

export default TimeAgo