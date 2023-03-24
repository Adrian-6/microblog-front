import { parseISO, formatDistanceToNow, format } from 'date-fns'

const TimeAgo = ({ timestamp, dateFormat }) => {


    const date = parseISO(timestamp)
    const timePeriod = formatDistanceToNow(date)
    const formatted = format(date, 'dd/MM/yyyy k:mm')

    const time = dateFormat === 'formatted' ? formatted : `${timePeriod} ago`

    return (
        <span title={`${timePeriod} ago`} className="post-time-ago">
            {time}
        </span>
    )
}

export default TimeAgo
