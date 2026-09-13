const ArrowIcon = ({ direction }) => (
  <svg viewBox="0 0 24 24" className="icon small-icon" aria-hidden="true">
    <path
      d={
        direction === "previous"
          ? "M19 12H6m6 6-6-6 6-6"
          : "M5 12h13m-5-6 6 6-6 6"
      }
    />
  </svg>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Job listings pagination">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ArrowIcon direction="previous" />
        Previous
      </button>
      {pages.map((page) => (
        <button
          type="button"
          key={page}
          className={page === currentPage ? "active-page" : ""}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ArrowIcon direction="next" />
      </button>
    </nav>
  );
};

export default Pagination;
