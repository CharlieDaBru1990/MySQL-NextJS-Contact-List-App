/**
 * The Pagination component generates a pagination UI based on the total item count, page
 * size, current page, and onPageChange function provided as props.
 
 * @returns The Pagination component is being returned. It generates a pagination UI based on the
 * itemCount, pageSize, currentPage, and onPageChange props provided to it. The component calculates
 * the total number of pages needed based on the itemCount and pageSize, creates an array of page
 * numbers, and renders a list of clickable page numbers. The active page is highlighted based on the
 * currentPage prop.
 */
function Pagination({ itemCount, pageSize, currentPage, onPageChange }) {
  const totalPages = Math.ceil(itemCount / pageSize);

  if (totalPages == 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <ul className="pagination">
          {pages.map((page) => {
            return (
              <li
                key={page}
                className={`page-item ${page == currentPage ? "active" : ""}`}
              >
                <a
                  className="page-link"
                  onClick={() => onPageChange(page)}
                  href="#"
                >
                  {page}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Pagination;
