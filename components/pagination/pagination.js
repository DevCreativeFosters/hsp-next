'use client';

import { useEffect, useState } from 'react';
import Button from '@components/button/button';
import { usePaginationContext } from '@contexts/pagination';

import styles from './pagination.module.scss';

export default function Pagination({
  perPage,
  totalPosts,
  maxPagesToShow = 3,
  scope,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const { setValue: setPaginationValue } = usePaginationContext(scope);
  const totalPages = Math.ceil(totalPosts / perPage);

  useEffect(() => {
    setPaginationValue(currentValue => {
      const scopeObj = {};
      scopeObj[scope] = currentPage;
      return { ...currentValue, ...scopeObj };
    });
  }, [scope, currentPage, setPaginationValue]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const pageButtons = [];
  const half = Math.floor((maxPagesToShow - 1) / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = Math.min(maxPagesToShow, totalPages);
  }

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(totalPages - maxPagesToShow + 1, 1);
  }

  if (start > 1) {
    pageButtons.push(1);
  }

  if (start > 2) {
    pageButtons.push('...');
  }

  for (let i = start; i <= end; i++) {
    pageButtons.push(i);
  }

  if (end < totalPages - 1) {
    pageButtons.push('...');
  }

  if (end < totalPages) {
    pageButtons.push(totalPages);
  }

  return (
    <div className={styles.pagination}>
      <Button
        size="mixed"
        variant="secondary"
        rightIcon="arrow-previous"
        disabled={currentPage === 1}
        onClick={handlePrevious}
      />

      {pageButtons.map((value, index) => {
        const isNumber = Number.isInteger(value);
        const isCurrent = currentPage === value;
        const variant = isCurrent
          ? 'primary'
          : isNumber
          ? 'secondary'
          : 'ternary';
        return (
          <Button
            key={`${value}-${index}`}
            size="mixed"
            variant={variant}
            disabled={!isNumber || isCurrent}
            onClick={() => (isNumber ? setCurrentPage(value) : null)}
          >
            {value}
          </Button>
        );
      })}

      <Button
        size="mixed"
        variant="secondary"
        rightIcon="arrow-next"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      />
    </div>
  );
}
