'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/captions.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';

import { fetchAPI } from '@lib/fetch-api';

import Button from '@components/button/button';

import RatingStar from '@assets/icons/rating-star.svg';

import styles from './product-tabs.module.scss';

const CREATE_REVIEW_MUTATION = `
  mutation CreateProductReviewWithImages(
    $productId: Int!
    $rating: Int!
    $authorName: String!
    $authorEmail: String!
    $content: String!
    $images: [String!]
  ) {
    createProductReviewWithImages(
      input: {
        productId: $productId
        rating: $rating
        authorName: $authorName
        authorEmail: $authorEmail
        content: $content
        images: $images
      }
    ) {
      success
      commentId
      message
    }
  }
`;

const fileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function ReviewsContent({ productId, productName, reviews }) {
  const dropdownRef = useRef(null);
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
  ];

  const INITIAL_VISIBLE = 4;
  const [showNoOfReviews, setShowNoOfReviews] = useState(INITIAL_VISIBLE);

  const [lightboxSlides, setLightboxSlides] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);

  const sortedReviews = useMemo(() => {
    if (!reviews || !Array.isArray(reviews)) return [];

    const sorted = [...reviews];

    switch (selectedSortOption.value) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));

      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));

      default:
        return sorted;
    }
  }, [reviews, selectedSortOption]);

  const handleSortToggle = () => setIsSortDropdownOpen(prev => !prev);

  const handleSortSelect = option => {
    setSelectedSortOption(option);
    setIsSortDropdownOpen(false);
    // Add logic here to actually sort the "reviews" array if needed
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [showReviewForm, setShowReviewForm] = useState(false);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmitReview = async e => {
    e.preventDefault();
    setSubmitMessage('');

    if (!rating) {
      setSubmitMessage('❌ Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const files = formData
        .getAll('uploadImage')
        .filter(f => f instanceof File && f.size > 0);

      let images = [];

      if (files.length) {
        images = await Promise.all(files.map(fileToBase64));
      }

      const variables = {
        authorEmail: formData.get('authorEmail'),
        authorName: formData.get('authorName'),
        content: formData.get('content'),
        images,
        productId,
        rating, // Base64 array
      };

      const res = await fetchAPI(CREATE_REVIEW_MUTATION, {
        variables,
      });

      const reviewRes = res?.createProductReviewWithImages;

      if (reviewRes?.success) {
        form.reset();
        setSubmitMessage('✅ ' + reviewRes.message);
        setTimeout(() => {
          setShowReviewForm(false);
        }, 5000);
      } else {
        if (reviewRes?.message) setSubmitMessage('❌ ' + reviewRes.message);
        else setSubmitMessage('❌ Failed to submit review');
      }
    } catch (err) {
      setSubmitMessage(`❌ ${err.message || 'Something went wrong'}`);
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setRating(0);
        setHover(0);
        setSubmitMessage('');
      }, 5000);
    }
  };

  return (
    <div className={styles.reviewsWrapper}>
      <div className={styles.reviewWrap}>
        <div className={styles.heading}>
          <Button
            className={styles.reviewButton}
            onClick={() => setShowReviewForm(true)}
            size="large"
            variant="primary"
          >
            Leave A Review
          </Button>

          <div className={styles.pWrap}>
            <div className={styles.title}>Sort By:</div>
            <div
              className={clsx(styles.customSelectBox, {
                [styles.open]: isSortDropdownOpen,
              })}
              ref={dropdownRef}
            >
              <div
                aria-controls="sort-options-list"
                aria-expanded={isSortDropdownOpen}
                className={styles.selectedOption}
                onClick={handleSortToggle}
                onKeyDown={e => e.key === 'Enter' && handleSortToggle()}
                role="button"
                tabIndex="0"
              >
                {selectedSortOption.label}
                <div
                  className={clsx(styles.arrow, {
                    [styles.open]: isSortDropdownOpen,
                  })}
                ></div>
              </div>

              {isSortDropdownOpen && (
                <ul
                  className={styles.optionsList}
                  id="sort-options-list"
                  role="listbox"
                >
                  {sortOptions.map(option => (
                    <li
                      aria-selected={selectedSortOption.value === option.value}
                      className={clsx({
                        [styles.selected]:
                          selectedSortOption.value === option.value,
                      })}
                      key={option.value}
                      onClick={() => handleSortSelect(option)}
                      onKeyDown={e =>
                        e.key === 'Enter' && handleSortSelect(option)
                      }
                      role="option"
                      tabIndex="0"
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {showReviewForm && (
          <form className={styles.reviewForm} onSubmit={handleSubmitReview}>
            <h2>Leave A Review</h2>

            <div className={styles.colFull}>
              <div className={styles.inputGroup}>
                <label>
                  How Would You rate us ?{' '}
                  <span className={styles.reqStar}>*</span>
                </label>
                <div className={styles.starRatingContainer}>
                  {[1, 2, 3, 4, 5].map(starValue => {
                    return (
                      <button
                        aria-label={`Rate ${starValue} stars`}
                        className={clsx(styles.starButton, {
                          [styles.filled]: (hover || rating) >= starValue,
                        })}
                        key={starValue}
                        onClick={() => {
                          setRating(starValue);
                          setHover(starValue);
                        }}
                        type="button"
                      >
                        <RatingStar />
                      </button>
                    );
                  })}
                </div>
                <input name="rating" type="hidden" value={rating} />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.colHalf}>
                <div className={styles.inputGroup}>
                  <label>
                    Name<span className={styles.reqStar}>*</span>
                  </label>
                  <input name="authorName" required type="text" />
                </div>
              </div>

              <div className={styles.colHalf}>
                <div className={styles.inputGroup}>
                  <label>
                    Email<span className={styles.reqStar}>*</span>
                  </label>
                  <input name="authorEmail" required type="email" />
                </div>
              </div>

              <div className={styles.colFull}>
                <div className={styles.inputGroup}>
                  <label>Upload Image</label>
                  <input
                    accept="image/*"
                    multiple
                    name="uploadImage"
                    type="file"
                  />
                </div>
              </div>

              <div className={styles.colFull}>
                <div className={styles.inputGroup}>
                  <label>
                    Comment<span className={styles.reqStar}>*</span>
                  </label>
                  <textarea name="content" required />
                </div>
              </div>

              <div className={clsx(styles.colFull, styles.submitBtn)}>
                <div className={styles.inputGroup}>
                  <Button
                    disabled={submitting}
                    size="large"
                    type="submit"
                    variant="primary"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </div>
            </div>

            {submitMessage && (
              <p
                className={styles.submitMessage}
                style={{
                  color: submitMessage.startsWith('✅') ? 'green' : 'red',
                  marginTop: '12px',
                }}
              >
                {submitMessage}
              </p>
            )}
          </form>
        )}

        <div className={styles.reviewLists}>
          {sortedReviews?.length > 0 ? (
            <>
              {sortedReviews.map((review, index) => {
                if (index >= showNoOfReviews) return null;

                const author = review?.author?.node;
                const img = review?.reviewUploadImage?.uploadImage?.nodes?.[0];
                const images = review?.reviewUploadImage?.uploadImage?.nodes;

                return (
                  <div className={styles.reviewBox} key={review.databaseId}>
                    <div className={styles.left}>
                      <div className={styles.filled}>
                        {Array.from({ length: review?.rating }, (_, i) => (
                          <RatingStar key={i} />
                        ))}
                      </div>
                      <div
                        className={styles.desc}
                        dangerouslySetInnerHTML={{ __html: review.content }}
                      ></div>
                      <div className={styles.reviewAuthor}>
                        <p>
                          <strong>{author?.name}</strong>
                        </p>
                        <span>Ordered the HSP {productName}</span>
                      </div>
                    </div>
                    {img && (
                      <div
                        className={styles.right}
                        onClick={() => {
                          const slides =
                            images?.map(img => ({
                              alt: img.altText || '',
                              description:
                                review.content.replace(/<[^>]+>/g, '') || '',
                              src: img.sourceUrl,
                              title: author?.name || '',
                            })) || [];

                          setLightboxSlides(slides);
                          setLightboxOpen(true);
                        }}
                      >
                        <figure>
                          <Image
                            alt={img.altText}
                            height={160}
                            src={img.sourceUrl}
                            width={250}
                          />
                        </figure>
                      </div>
                    )}
                  </div>
                );
              })}
              {sortedReviews.length > INITIAL_VISIBLE && (
                <div className={styles.buttonGroup}>
                  {showNoOfReviews > INITIAL_VISIBLE && (
                    <Button
                      className={clsx(styles.buttonToggle, styles.isActive)}
                      onClick={() => setShowNoOfReviews(INITIAL_VISIBLE)}
                      rightIcon={'arrow-forward'}
                      type="button"
                    >
                      Show less
                    </Button>
                  )}
                  {showNoOfReviews < sortedReviews.length && (
                    <Button
                      className={clsx(styles.buttonToggle)}
                      onClick={() =>
                        setShowNoOfReviews(prev => prev + INITIAL_VISIBLE)
                      }
                      rightIcon={'arrow-forward'}
                      type="button"
                    >
                      Show more
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className={styles.noReviews}>
              <h3>Be the first to review this product</h3>
            </div>
          )}
        </div>

        <Lightbox
          carousel={{ finite: true }}
          close={() => setLightboxOpen(false)}
          open={lightboxOpen}
          plugins={[Captions, Fullscreen, Thumbnails]}
          slides={lightboxSlides}
        />
      </div>
    </div>
  );
}
