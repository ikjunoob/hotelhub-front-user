import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faHeart, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import "../../styles/pages/mypage/ProfilePage.scss";

const ProfilePage = () => {
  const { user, updateProfile, setUser, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [editingField, setEditingField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cards, setCards] = useState([
    {
      id: 1,
      cardNumber: "4532",
      expiryDate: "02/27",
      cardholderName: "이용자",
      isActive: true
    }
  ]);
  const [newCard, setNewCard] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });
  const [cardErrors, setCardErrors] = useState({});

  // 계정 정보 상태
  const [formData, setFormData] = useState({
    name: user?.name || "정보 없음",
    email: user?.email || "정보 없음",
    phone: user?.phone || "정보 없음",
    address: user?.address || "정보 없음",
    dateOfBirth: user?.dateOfBirth || ""
  });

  // 임시 수정값 저장
  const [editValue, setEditValue] = useState("");

  // 이메일 변경 플로우 상태 (요청 -> 확인 -> 완료)
  const [emailChangeStep, setEmailChangeStep] = useState(null); // null | 'request' | 'confirm' | 'success'
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [emailChangeMessage, setEmailChangeMessage] = useState("");

  const mapEmailChangeError = (code) => {
    const friendly = {
      EMAIL_ALREADY_IN_USE: "이미 사용 중인 이메일입니다.",
      CODE_MISMATCH: "인증번호가 올바르지 않습니다.",
      CODE_EXPIRED: "인증번호가 만료되었습니다. 다시 요청해주세요.",
      EMAIL_CHANGE_NOT_REQUESTED: "인증번호를 먼저 요청해주세요.",
      CODE_NOT_FOUND: "인증번호를 찾을 수 없습니다.",
      EMAIL_CHANGE_CODE_NOT_FOUND: "인증번호를 찾을 수 없습니다.",
    };
    return friendly[code] || code;
  };

  // 수정 시작
  const handleEditStart = (field, currentValue) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (field === "email") {
      const nextEmail = currentValue === "정보 없음" ? "" : currentValue;
      setNewEmail(nextEmail);
      setEmailCode("");
      setEmailChangeMessage("");
      setEmailChangeStep("request");
      setEditingField(null);
      setEditValue("");
      return;
    }

    setEditingField(field);
    setEditValue(currentValue === "정보 없음" ? "" : currentValue);
  };

  // 수정 저장
  const handleEditSave = async (field) => {
    // 필드 유효성 검사
    if (!editValue.trim()) {
      setErrorMessage("필수 정보입니다.");
      return;
    }

    // 이메일 형식 검사
    if (field === "email" && !isValidEmail(editValue)) {
      setErrorMessage("올바른 이메일 형식이 아닙니다.");
      return;
    }

    // 전화번호 형식 검사
    if (field === "phone" && !isValidPhone(editValue)) {
      setErrorMessage("올바른 전화번호 형식이 아닙니다. (010-1234-5678)");
      return;
    }

    // 이메일 변경은 별도 플로우 사용
    if (field === "email") {
      setErrorMessage("");
      setEmailChangeMessage("");
      setEmailChangeStep("request");
      setNewEmail(editValue);
      setEmailCode("");
      setEditingField(null);
      setEditValue("");
      return;
    }

    setIsLoading(true);
    try {
      // 프로필 업데이트 API 호출
      const updateData = { [field]: editValue };
      await updateProfile(updateData);

      // 로컬 상태 업데이트
      setFormData({
        ...formData,
        [field]: editValue
      });

      setEditingField(null);
      setEditValue("");
      setSuccessMessage(`${getFieldLabel(field)}이 업데이트되었습니다.`);
      
      // 3초 후 성공 메시지 제거
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      setErrorMessage("업데이트 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue("");
    setErrorMessage("");
  };

  const handleEmailChangeRequest = async () => {
    const normalizedEmail = newEmail.trim();
    if (!isValidEmail(normalizedEmail)) {
      setErrorMessage("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setNewEmail(normalizedEmail);
    setErrorMessage("");
    setEmailChangeMessage("");

    try {
      setEmailChangeLoading(true);
      await authApi.requestEmailChange(normalizedEmail);
      setEmailChangeStep("confirm");
      setEmailChangeMessage("입력하신 이메일로 인증 코드가 발송되었습니다.");
    } catch (error) {
      const msgCode = error?.response?.data?.message;
      const msg = mapEmailChangeError(msgCode) || "인증 코드 요청에 실패했습니다.";
      setErrorMessage(msg);
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleEmailChangeConfirm = async () => {
    const trimmedCode = emailCode.trim();
    if (!trimmedCode) {
      setErrorMessage("인증 코드를 입력하세요.");
      return;
    }

    setErrorMessage("");
    setEmailChangeMessage("");

    try {
      setEmailChangeLoading(true);
      await authApi.confirmEmailChange(trimmedCode);
      setEmailChangeStep("success");
      setEmailChangeMessage("이메일이 성공적으로 변경되었습니다.");
      setSuccessMessage("이메일이 업데이트되었습니다.");
      setEditingField(null);
      setEditValue("");
      setEmailCode("");

      // 즉시 UI 반영 (낙관적 업데이트)
      setFormData((prev) => ({
        ...prev,
        email: newEmail
      }));
      setUser((prev) => (prev ? { ...prev, email: newEmail } : prev));

      setTimeout(() => setSuccessMessage(""), 3000);

      // 서버 값으로 동기화
      const refreshed = await refreshUser();
      if (refreshed?.email) {
        setFormData((prev) => ({
          ...prev,
          email: refreshed.email
        }));
      }
    } catch (error) {
      const msgCode = error?.response?.data?.message;
      const msg = mapEmailChangeError(msgCode) || "이메일 변경에 실패했습니다.";
      setErrorMessage(msg);
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleEmailChangeCancel = () => {
    setEmailChangeStep(null);
    setNewEmail("");
    setEmailCode("");
    setEmailChangeMessage("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  // 이메일 유효성 검사
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 전화번호 유효성 검사
  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

  // 필드명 한글로 변환
  const getFieldLabel = (field) => {
    const labels = {
      name: "이름",
      email: "이메일",
      phone: "전화번호",
      address: "주소",
      dateOfBirth: "생년월일"
    };
    return labels[field] || field;
  };

  // 카드 추가 모달 열기
  const handleOpenAddCardModal = () => {
    setShowAddCardModal(true);
    setNewCard({
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: ""
    });
    setCardErrors({});
  };

  // 카드 추가 모달 닫기
  const handleCloseAddCardModal = () => {
    setShowAddCardModal(false);
    setNewCard({
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: ""
    });
    setCardErrors({});
  };

  // 카드 입력값 변경
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // 카드 번호 포매팅 (4자리씩 띄어쓰기)
    if (name === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})/g, "$1 ").trim();
    }

    // 유효기간 포매팅 (MM/YY)
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
      }
    }

    // CVV 숫자만
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setNewCard({
      ...newCard,
      [name]: formattedValue
    });
  };

  // 카드 유효성 검사
  const validateCard = () => {
    const errors = {};

    if (!newCard.cardholderName.trim()) {
      errors.cardholderName = "카드 소유자 이름은 필수입니다.";
    }

    const cardNumberOnly = newCard.cardNumber.replace(/\s/g, "");
    if (!cardNumberOnly || cardNumberOnly.length !== 16) {
      errors.cardNumber = "16자리 카드 번호를 입력하세요.";
    }

    if (!newCard.expiryDate || newCard.expiryDate.length !== 5) {
      errors.expiryDate = "유효기간을 MM/YY 형식으로 입력하세요.";
    } else {
      const [month, year] = newCard.expiryDate.split("/");
      if (parseInt(month) > 12 || parseInt(month) < 1) {
        errors.expiryDate = "월(01-12)을 올바르게 입력하세요.";
      }
    }

    if (!newCard.cvv || newCard.cvv.length !== 3) {
      errors.cvv = "3자리 CVV를 입력하세요.";
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 카드 추가 저장
  const handleAddCard = () => {
    if (!validateCard()) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // 새 카드 추가
      const cardNumber = newCard.cardNumber.replace(/\s/g, "").slice(-4);
      const newCardData = {
        id: Date.now(),
        cardNumber: cardNumber,
        expiryDate: newCard.expiryDate,
        cardholderName: newCard.cardholderName,
        isActive: false
      };

      setCards([...cards, newCardData]);
      setIsLoading(false);
      handleCloseAddCardModal();
      setSuccessMessage("카드가 추가되었습니다.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  // 카드 삭제
  const handleDeleteCard = (cardId) => {
    if (cards.length === 1) {
      setErrorMessage("최소 1개 이상의 카드가 필요합니다.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    setCards(cards.filter(card => card.id !== cardId));
    setSuccessMessage("카드가 삭제되었습니다.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // 기본 카드 변경
  const handleSetDefaultCard = (cardId) => {
    setCards(cards.map(card => ({
      ...card,
      isActive: card.id === cardId
    })));
    setSuccessMessage("기본 결제 수단이 변경되었습니다.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // 필드 렌더링
  const renderField = (label, field, value) => {
    const isEditing = editingField === field;
    
    return (
      <div className="field-row" key={field}>
        <label>{label}</label>
        <div className="field-value">
          {isEditing ? (
            <div className="field-edit">
              {field === "dateOfBirth" ? (
                <input
                  type="date"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="edit-input"
                  disabled={isLoading}
                />
              ) : (
                <input
                  type={field === "email" ? "email" : "text"}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="edit-input"
                  autoFocus
                  disabled={isLoading}
                  placeholder={`${label}을 입력하세요`}
                />
              )}
              <div className="edit-actions">
                <button 
                  className="btn-confirm"
                  onClick={() => handleEditSave(field)}
                  title="저장"
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
                <button 
                  className="btn-cancel"
                  onClick={handleEditCancel}
                  title="취소"
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <span>{!value || value === "정보 없음" ? "정보 없음" : value}</span>
              <button 
                className="btn-change"
                onClick={() => handleEditStart(field, value)}
              >
                수정
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="profile-page">
      {/* 헤더 영역 */}
      <div className="profile-header">
        <div className="header-bg">
          <div className="gradient-overlay"></div>
        </div>
        <div className="profile-avatar-section">
          <div className="avatar-wrapper">
            <img src="/images/profile-placeholder.png" alt="Profile" className="avatar-img" />
            <button className="btn-upload-photo">
              <FontAwesomeIcon icon={faCamera} />
            </button>
          </div>
          <button className="btn-upload-cover">
            <FontAwesomeIcon icon={faCamera} />
            Upload new cover
          </button>
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{user?.name || "사용자"}</h2>
          <p className="profile-email">{user?.email || "이메일 없음"}</p>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === "account" ? "active" : ""}`}
          onClick={() => setActiveTab("account")}
        >
          Account
        </button>
        <button 
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
        <button 
          className={`tab-btn ${activeTab === "payment" ? "active" : ""}`}
          onClick={() => setActiveTab("payment")}
        >
          Payment methods
        </button>
      </div>

      {/* Account 탭 콘텐츠 */}
      {activeTab === "account" && (
        <div className="account-content">
          <h3 className="section-title">계정 정보</h3>
          
          {/* 메시지 표시 */}
          {successMessage && (
            <div className="message success-message">
              ✓ {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="message error-message">
              ✕ {errorMessage}
            </div>
          )}
          
          <div className="account-fields">
            {renderField("이름", "name", formData.name)}
            {renderField("이메일", "email", formData.email)}
            {renderField("전화번호", "phone", formData.phone)}
            {renderField("주소", "address", formData.address)}
            {renderField("생년월일", "dateOfBirth", formData.dateOfBirth)}
          </div>
        </div>
      )}

      {/* History 탭 콘텐츠 */}
      {activeTab === "history" && (
        <div className="history-content">
          <div className="history-header">
            <h3>예약내역</h3>
            <select className="sort-select">
              <option>Upcoming</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="booking-list">
            {[1, 2, 3].map((item) => (
              <div key={item} className="booking-card">
                <div className="booking-date">
                  <div className="date-badge">
                    <span className="day">08</span>
                    <span className="month">DEC</span>
                  </div>
                </div>
                <div className="booking-details">
                  <div className="detail-row">
                    <span className="label">Check In</span>
                    <span className="value">Thur, Dec 8</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Check Out</span>
                    <span className="value">Fri, Dec 9</span>
                  </div>
                </div>
                <div className="booking-time">
                  <div className="time-info">
                    <div className="label">Check In</div>
                    <div className="value">12:00pm</div>
                  </div>
                  <div className="time-info">
                    <div className="label">Room No.</div>
                    <div className="value">On arrival</div>
                  </div>
                </div>
                <button className="btn-download">Download Ticket</button>
                <button className="btn-arrow">›</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment 탭 콘텐츠 */}
      {activeTab === "payment" && (
        <div className="payment-content">
          <h3 className="section-title">결제수단</h3>
          
          {/* 메시지 표시 */}
          {successMessage && (
            <div className="message success-message">
              ✓ {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="message error-message">
              ✕ {errorMessage}
            </div>
          )}
          
          <div className="cards-grid">
            {/* 저장된 카드 목록 */}
            {cards.map((card) => (
              <div key={card.id} className={`payment-card ${card.isActive ? "active" : ""}`}>
                <div className="card-top">
                  <span className="card-label">**** **** **** {card.cardNumber}</span>
                  <div className="card-logo">VISA</div>
                </div>
                <div className="card-number">{card.cardNumber}</div>
                <div className="card-holder">{card.cardholderName}</div>
                <div className="card-bottom">
                  <div className="card-info">
                    <span className="label">Valid Thru</span>
                    <span className="value">{card.expiryDate}</span>
                  </div>
                  <div className="card-actions">
                    {!card.isActive && (
                      <button 
                        className="btn-card-action"
                        onClick={() => handleSetDefaultCard(card.id)}
                        title="기본 카드로 설정"
                      >
                        기본설정
                      </button>
                    )}
                    <button 
                      className="btn-card-delete"
                      onClick={() => handleDeleteCard(card.id)}
                      title="삭제"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* 카드 추가 버튼 */}
            <div 
              className="add-card-btn"
              onClick={handleOpenAddCardModal}
            >
              <div className="plus-icon">+</div>
              <span>Add a new card</span>
            </div>
          </div>
        </div>
      )}

      {emailChangeStep && (
        <div className="email-change-overlay" onClick={handleEmailChangeCancel}>
          <div className="email-change-modal" onClick={(e) => e.stopPropagation()}>
            <div className="email-change-glow" />
            <div className="email-change-header">
              <div className="pill">Email Update</div>
              <div className="email-change-title">
                <h3>이메일 변경</h3>
                <p>현재 이메일: {formData.email || "정보 없음"}</p>
              </div>
              <button className="icon-btn" onClick={handleEmailChangeCancel} disabled={emailChangeLoading}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="email-change-steps">
              <span className={emailChangeStep === "request" ? "active" : ""}>1. 새 이메일 입력</span>
              <span className={emailChangeStep === "confirm" ? "active" : emailChangeStep === "success" ? "done" : ""}>2. 인증번호 입력</span>
              <span className={emailChangeStep === "success" ? "done" : ""}>3. 완료</span>
            </div>

            {errorMessage && (
              <div className="message error-message inline-message">✕ {errorMessage}</div>
            )}
            {emailChangeMessage && (
              <div className="message success-message inline-message">✓ {emailChangeMessage}</div>
            )}

            {emailChangeStep === "request" && (
              <div className="email-change-body">
                <p className="helper-text">새 이메일을 입력하고 인증번호를 받아주세요.</p>
                <div className="input-row">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new-email@example.com"
                    disabled={emailChangeLoading}
                  />
                  <button
                    className="btn-primary"
                    onClick={handleEmailChangeRequest}
                    disabled={emailChangeLoading || !newEmail.trim()}
                  >
                    {emailChangeLoading ? "전송 중..." : "인증번호 요청"}
                  </button>
                </div>
              </div>
            )}

            {emailChangeStep === "confirm" && (
              <div className="email-change-body">
                <p className="helper-text">{newEmail} 로 전송된 6자리 코드를 입력하세요.</p>
                <div className="input-row">
                  <input
                    type="text"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    placeholder="인증번호 6자리"
                    disabled={emailChangeLoading}
                  />
                  <button
                    className="btn-primary"
                    onClick={handleEmailChangeConfirm}
                    disabled={emailChangeLoading || !emailCode.trim()}
                  >
                    {emailChangeLoading ? "확인 중..." : "확인"}
                  </button>
                </div>
                <div className="email-change-actions">
                  <button
                    className="ghost-btn"
                    onClick={handleEmailChangeRequest}
                    disabled={emailChangeLoading}
                  >
                    인증번호 다시 받기
                  </button>
                  <button
                    className="ghost-btn"
                    onClick={handleEmailChangeCancel}
                    disabled={emailChangeLoading}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {emailChangeStep === "success" && (
              <div className="email-change-success">
                <div className="success-icon">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <h4>이메일 변경 완료</h4>
                <p>{newEmail} 으로 변경되었습니다.</p>
                <button className="btn-primary" onClick={handleEmailChangeCancel}>닫기</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 카드 추가 모달 */}
      {showAddCardModal && (
        <div className="modal-overlay">
          <div className="modal-content card-modal">
            <div className="modal-header">
              <h2>새 카드 추가</h2>
              <button 
                className="modal-close"
                onClick={handleCloseAddCardModal}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>카드 소유자 이름</label>
                <input
                  type="text"
                  name="cardholderName"
                  value={newCard.cardholderName}
                  onChange={handleCardInputChange}
                  placeholder="홍길동"
                  className={cardErrors.cardholderName ? "error" : ""}
                />
                {cardErrors.cardholderName && (
                  <span className="error-message">{cardErrors.cardholderName}</span>
                )}
              </div>

              <div className="form-group">
                <label>카드 번호</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={newCard.cardNumber}
                  onChange={handleCardInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={cardErrors.cardNumber ? "error" : ""}
                />
                {cardErrors.cardNumber && (
                  <span className="error-message">{cardErrors.cardNumber}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>유효기간</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={newCard.expiryDate}
                    onChange={handleCardInputChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    className={cardErrors.expiryDate ? "error" : ""}
                  />
                  {cardErrors.expiryDate && (
                    <span className="error-message">{cardErrors.expiryDate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={newCard.cvv}
                    onChange={handleCardInputChange}
                    placeholder="123"
                    maxLength="3"
                    className={cardErrors.cvv ? "error" : ""}
                  />
                  {cardErrors.cvv && (
                    <span className="error-message">{cardErrors.cvv}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel-modal"
                onClick={handleCloseAddCardModal}
                disabled={isLoading}
              >
                취소
              </button>
              <button 
                className="btn-add-card"
                onClick={handleAddCard}
                disabled={isLoading}
              >
                {isLoading ? "추가 중..." : "카드 추가"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
