const PagesList = ({ page, pages }) => {

    //creates the array of numbers to use in a page list
    let i = 1;

    let pagesNum = [page]

    while (i <= 3) {
        if (page - i > 0) {
            pagesNum.unshift(page - i)
        } else if (page + i <= pages) {
            pagesNum.push(page + i)
            i++
        }
        if (page + i <= pages) {
            pagesNum.push(page + i)
        } else if (page - i > 1) {
            pagesNum.unshift(page - 1 - i)
            i++
        }
        i++
    }

    const firstPage = (pagesNum.at(0) > 2) ? <><a href={`/posts/page/1`} key="1">1</a>...</> : (pagesNum.at(0) === 2) ? <a href={`/posts/page/1`} key="1">1</a> : null
    const lastPage = (pagesNum.at(-1) < pages - 1) ? <>...<a href={`/posts/page/${pages}`} key={pages}>{pages}</a></> : (pagesNum.at(-1) === pages - 1) ? <a href={`/posts/page/${pages}`} key={pages}>{pages}</a> : null

    let pageLinks = pagesNum.map(num => {
        if (page == num) {
            return <a href={`/posts/page/${num}`} className='current-page' key={num}>{num}</a>
        }
        return <a href={`/posts/page/${num}`} key={num}>{num}</a>
    })
    return (
        <span className="page-list">
            {firstPage}
            {pageLinks}
            {lastPage}
        </span>
    )
}

export default PagesList