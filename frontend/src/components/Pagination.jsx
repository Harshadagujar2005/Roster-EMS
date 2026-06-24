import React from 'react';
import './Pagination.css';

const buildPageList = (page, totalPages) => {
  const pages = [];
  const windowSize = 1;
  const start = Math.max(1, page - windowSize);
  const end = Math.min(totalPages, page + windowSize);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('ellipsis-start');
  }

  for (let i = start; i <= end; i += 1) pages.push(i);

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('ellipsis-end');
    pages.push(totalPages);
  }

  return pages;
};

/**
 * @param {{page: number, totalPages: number, total: number, limit: number, onPageChange: (page:number)=>void}} props
 */
const Pagination = ({ page, totalPages, total, limit, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);
  const rangeStart = (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <span className="pagination-summary">
        Showing <strong>{rangeStart}–{rangeEnd}</strong> of <strong>{total}</strong>
      </span>

      <div className="pagination-controls">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>

        <div className="pagination-pages">
          {pages.map((item) =>
            typeof item === 'number' ? (
              <button
                key={item}
                type="button"
                className={`pagination-page ${item === page ? 'pagination-page-active' : ''}`}
                onClick={() => onPageChange(item)}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </button>
            ) : (
              <span key={item} className="pagination-ellipsis">…</span>
            )
          )}
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
