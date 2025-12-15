import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../../styles/pages/mypage/MyInquiriesPage.scss';

const MyInquiriesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    content: ''
  });

  // 샘플 문의 데이터
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      title: '예약 취소 문의',
      category: 'booking',
      status: 'answered',
      createdAt: '2024-12-10',
      content: '예약을 취소하고 싶습니다.',
      answer: '예약 취소가 완료되었습니다. 환불은 3-5일 소요됩니다.'
    },
    {
      id: 2,
      title: '호텔 정보 문의',
      category: 'hotel',
      status: 'pending',
      createdAt: '2024-12-08',
      content: '호텔 시설에 대해 더 자세히 알고 싶습니다.'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 새로운 문의 객체 생성
    const newInquiry = {
      id: Date.now(), // 간단한 ID 생성 (실제로는 서버에서 생성)
      title: formData.title,
      category: formData.category,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식
      content: formData.content
    };

    // 문의 목록에 추가
    setInquiries(prev => [newInquiry, ...prev]);

    // 폼 초기화 및 닫기
    setFormData({ title: '', category: 'general', content: '' });
    setShowForm(false);

    alert('문의가 접수되었습니다.');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon answered" />;
      case 'pending':
        return <FontAwesomeIcon icon={faClock} className="status-icon pending" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'answered':
        return '답변완료';
      case 'pending':
        return '답변대기';
      default:
        return '';
    }
  };

  const getCategoryText = (category) => {
    const categories = {
      general: '일반문의',
      booking: '예약문의',
      hotel: '호텔문의',
      payment: '결제문의',
      technical: '기술지원'
    };
    return categories[category] || category;
  };

  return (
    <div className="my-inquiries-page">
      <div className="page-header">
        <h1>1:1 문의</h1>
        <p>궁금한 점이 있으시면 언제든지 문의해주세요.</p>
      </div>

      <div className="inquiries-container">
        <div className="inquiries-header">
          <h2>문의 내역</h2>
          <button
            className="btn-new-inquiry"
            onClick={() => setShowForm(!showForm)}
          >
            <FontAwesomeIcon icon={faPlus} />
            새 문의 작성
          </button>
        </div>

        {showForm && (
          <div className="inquiry-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>제목</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="문의 제목을 입력하세요"
                  required
                />
              </div>

              <div className="form-group">
                <label>카테고리</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="general">일반문의</option>
                  <option value="booking">예약문의</option>
                  <option value="hotel">호텔문의</option>
                  <option value="payment">결제문의</option>
                  <option value="technical">기술지원</option>
                </select>
              </div>

              <div className="form-group">
                <label>내용</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="문의 내용을 자세히 입력하세요"
                  rows="5"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>취소</button>
                <button type="submit">문의하기</button>
              </div>
            </form>
          </div>
        )}

        <div className="inquiries-list">
          {inquiries.length === 0 ? (
            <div className="empty-state">
              <p>아직 문의 내역이 없습니다.</p>
            </div>
          ) : (
            inquiries.map(inquiry => (
              <div key={inquiry.id} className="inquiry-item">
                <div className="inquiry-header">
                  <div className="inquiry-info">
                    <h3>{inquiry.title}</h3>
                    <div className="inquiry-meta">
                      <span className="category">{getCategoryText(inquiry.category)}</span>
                      <span className="date">{inquiry.createdAt}</span>
                    </div>
                  </div>
                  <div className="inquiry-status">
                    {getStatusIcon(inquiry.status)}
                    <span>{getStatusText(inquiry.status)}</span>
                  </div>
                </div>

                <div className="inquiry-content">
                  <p>{inquiry.content}</p>
                  {inquiry.answer && (
                    <div className="inquiry-answer">
                      <strong>답변:</strong>
                      <p>{inquiry.answer}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyInquiriesPage;