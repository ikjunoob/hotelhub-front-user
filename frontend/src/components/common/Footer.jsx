import React from "react";
import Newsletter from "./Newsletter";
import { socialLinks, footerNavData } from "../../api/mockFooter";
import "../../styles/components/common/Footer.scss";

const Footer = () => {
 return (
  <footer>
   <Newsletter />
   <div className="footer-links">
    <div className="inner">
     <div className="social-links">
      <div className="logo">HotelHub</div>
      <p className="description">
       혁신적 호텔 여행의 모든 순간,
        <br/>HotelHub과 함께하세요.
      </p>
      <div className="social-icons">
       {socialLinks.map((social, index) => (
        <a
         key={index}
         href={social.href}
         target="_blank"
         rel="noopener noreferrer"
         className={`social-link ${social.className}`}
         aria-label={social.ariaLabel}
        ></a>
       ))}
      </div>
     </div>

     <div className="link-columns">
      {footerNavData.map((column, columnIndex) => (
       <div key={columnIndex} className="link-column">
        <h4>{column.title}</h4>
        <ul>
         {column.links.map((link, linkIndex) => (
          <li key={linkIndex}>
           <a href={link.href}>{link.name}</a>
          </li>
         ))}
        </ul>
       </div>
      ))}
     </div>

     <div className="follow-us">
      <h4 className="follow-title">Follow Us</h4>

      <div className="follow-icons">
       <a 
        href="https://www.kakao.com"
        target="_blank"
        rel="noopener noreferrer"
        className="follow-link kakao" 
        aria-label="Kakao"
       ></a>
       <a 
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="follow-link instagram" 
        aria-label="Instagram"
       ></a>
       <a 
        href="https://www.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="follow-link youtube" 
        aria-label="YouTube"
       ></a>
      </div>
     </div>
    </div>
   </div>

   <div className="footer-bottom">
    <div className="inner">
     <div className="footer-info">
      <div className="company-info">
       (주)호텔허브 | 대표: 홍길동 | 사업자등록번호: 123-45-67890
       <br />
       주소: 서울특별시 강남구 테헤란로 123, 4567 | 통신판매업신고:
       제2025-서울강남-1234호
      </div>
      <div className="copyright">© 2025 HotelHub Inc. All rights reserved.</div>
     </div>
     <div className="footer-contact">
      <div className="contact-info">
       고객센터: 1588-0000 (09:00 - 18:00) | 이메일: support@hotelhub.com
      </div>
     </div>
    </div>
   </div>
  </footer>
 );
};

export default Footer;