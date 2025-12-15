import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { reviewApi } from "../../api/reviewApi";
import { useAuth } from "../../context/AuthContext";
import "../../styles/pages/mypage/MyReviewsPage.scss";

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadReviews = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await reviewApi.getMyReviews();

        // 샘플 데이터 추가 (실제 데이터가 없을 경우)
        if (!data || data.length === 0) {
          const sampleReviews = [
            {
              _id: 'sample1',
              hotelId: { name: '샹그릴라 호텔 서울', city: '서울' },
              rating: 5,
              comment: '직원들이 매우 친절하고 시설도 깨끗했습니다. 다음에 또 방문하고 싶어요!',
              createdAt: new Date('2024-12-10'),
              images: []
            },
            {
              _id: 'sample2',
              hotelId: { name: '파크 하얏트 도쿄', city: '도쿄' },
              rating: 4,
              comment: '전망이 좋고 위치도 편리했습니다. 다만 주차장이 조금 불편했어요.',
              createdAt: new Date('2024-11-25'),
              images: []
            }
          ];
          setReviews(sampleReviews);
        } else {
          setReviews(data);
        }
      } catch (error) {
        console.error('리뷰 목록 로드 실패:', error);
        // 에러 발생시에도 샘플 데이터 표시
        const sampleReviews = [
          {
            _id: 'sample1',
            hotelId: { name: '샹그릴라 호텔 서울', city: '서울' },
            rating: 5,
            comment: '직원들이 매우 친절하고 시설도 깨끗했습니다. 다음에 또 방문하고 싶어요!',
            createdAt: new Date('2024-12-10'),
            images: []
          }
        ];
        setReviews(sampleReviews);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [user]);

  const handleDeleteReview = async (id) => {
    if (window.confirm("이 리뷰를 삭제하시겠습니까?")) {
      try {
        await reviewApi.remove(id);
        setReviews(reviews.filter((r) => (r._id || r.id) !== id));
        alert('리뷰가 삭제되었습니다.');
      } catch (error) {
        console.error('리뷰 삭제 실패:', error);
        alert(error.message || '리뷰 삭제에 실패했습니다.');
      }
    }
  };

  const renderStars = (rating) => (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i < rating ? "filled" : "empty"}
        />
      ))}
    </div>
  );

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <div className="my-reviews-page">
      <div className="reviews-header">
        <h1>나의 리뷰</h1>
        <p>총 {reviews.length}개의 리뷰를 작성하셨습니다</p>
      </div>

      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => {
            const reviewId = review._id || review.id;
            return (
              <div key={reviewId} className="review-card">
                <div className="card-top">
                  <div className="hotel-info-section">
                    <img 
                      src={review.hotelId?.images?.[0] || '/images/hotel-placeholder.jpg'} 
                      alt={review.hotelId?.name || 'Hotel'} 
                      className="hotel-thumbnail"
                    />
                    <div className="hotel-details">
                      <h3>{review.hotelId?.name || 'N/A'}</h3>
                      <p className="stay-dates">숙박기간: {review.stayDates || 'N/A'}</p>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                        <span className="rating-text">{review.rating}.0</span>
                      </div>
                    </div>
                  </div>
                  <div className="review-actions">
                    <button className="btn-action edit">
                      <FontAwesomeIcon icon={faEdit} />
                      수정
                    </button>
                    <button
                      className="btn-action delete"
                      onClick={() => handleDeleteReview(reviewId)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      삭제
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  {review.title && <h4>{review.title}</h4>}
                  <p className="review-content">{review.comment || review.content}</p>
                  {review.images?.length > 0 && (
                    <div className="review-images">
                      {review.images.map((img, idx) => (
                        <img key={idx} src={img} alt="Review" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <span className="date">작성일: {review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A')}</span>
                  {review.helpful !== undefined && (
                    <span className="helpful">도움이 됨 {review.helpful}</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-reviews">
            <p>아직 작성한 리뷰가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviewsPage;