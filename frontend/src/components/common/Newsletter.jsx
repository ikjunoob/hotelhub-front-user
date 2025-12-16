import React, { useState } from "react";
import "../../styles/components/common/Newsletter.scss";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionMessage("이메일을 입력해주세요.");
      setTimeout(() => setSubscriptionMessage(""), 3000);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscriptionMessage("올바른 이메일 형식을 입력해주세요.");
      setTimeout(() => setSubscriptionMessage(""), 3000);
      return;
    }

    // 구독 완료 메시지
    setSubscriptionMessage("✓ 구독 완료! 감사합니다.");
    setEmail("");
    setTimeout(() => setSubscriptionMessage(""), 5000);
  };

  return (
    <div className="newsletter-section">
      {subscriptionMessage && (
        <div className="subscription-popup">
          <div className="popup-content">
            <div className="popup-icon">✓</div>
            <p>{subscriptionMessage}</p>
          </div>
        </div>
      )}
      <div className="inner">
        <div className="newsletter-card">
          
          {/* 1. 왼쪽: 텍스트 및 입력 폼 */}
          <div className="content-container">
            <h2 className="title">
              구독서비스<br />신청해보세요
            </h2>
            <div className="description-group">
              <p className="sub-title">The Travel</p>
              <p className="desc">구독하고 쿠폰, 최신 이벤트를 받아보세요.</p>
            </div>

            <form className="email-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                className="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="submit-btn">
                Subscribe
              </button>
            </form>
          </div>

          {/* 2. 오른쪽: CSS로 만든 3D 우체통 */}
          <div className={`mailbox-illustration ${subscriptionMessage ? 'active' : ''}`}>
            <div className="mailbox-body">
              {/* 입체감을 위한 뒷부분 (어두운 색) */}
              <div className="mailbox-depth"></div>
              {/* 앞부분 (밝은 색) */}
              <div className="mailbox-front"></div>
              {/* 깃발 */}
              <div className="mailbox-flag"></div>
              {/* 편지 들어가는 애니메이션 */}
              {subscriptionMessage && <div className="letter"></div>}
            </div>
            {/* 기둥 */}
            <div className="mailbox-post"></div>

            {/* 상시 떠다니는 편지들 */}
            <div className="ambient-letters" aria-hidden>
              <span className="floating-letter l1"></span>
              <span className="floating-letter l2"></span>
              <span className="floating-letter l3"></span>
            </div>

            {/* 상시 날아다니는 새들 */}
            <div className="ambient-birds" aria-hidden>
              <span className="bird b1"></span>
              <span className="bird b2"></span>
              <span className="bird b3"></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Newsletter;