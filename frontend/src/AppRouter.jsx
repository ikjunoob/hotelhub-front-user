/* 1. src/AppRouter.jsx */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import MyPageLayout from "./components/layouts/MyPageLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AddPaymentPage from "./pages/payment/AddPaymentPage";

// pages
import HomePage from "./pages/home/HomePage";
import SearchPage from "./pages/search/SearchPage";
import HotelListPage from "./pages/search/HotelListPage";
import HotelDetailPage from "./pages/hotel/HotelDetailPage";
import WishlistPage from "./pages/mypage/WishlistPage"; // ✅ WishlistPage 임포트 확인
import FlightSearchPage from "./pages/flight/FlightSearchPage"; // ✅ Flight 임포트

import BookingStepLayout from "./pages/booking/BookingStepLayout";
import BookingStepDates from "./pages/booking/BookingStepDates";
import BookingStepRoom from "./pages/booking/BookingStepRoom";
import BookingStepExtras from "./pages/booking/BookingStepExtras";
import BookingStepPayment from "./pages/booking/BookingStepPayment";
import BookingComplete from "./pages/booking/BookingComplete";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyPasswordResetPage from "./pages/auth/VerifyPasswordResetPage";
import ResetPasswordConfirmPage from "./pages/auth/ResetPasswordConfirmPage";
import KakaoCallbackPage from "./pages/auth/KakaoCallbackPage";
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage";

import MyOverviewPage from "./pages/mypage/MyOverviewPage";
import MyAccountPage from "./pages/mypage/MyAccountPage";
import MyPaymentPage from "./pages/mypage/MyPaymentPage";
import ProfilePage from "./pages/mypage/ProfilePage";
import MyBookingsPage from "./pages/mypage/MyBookingsPage";
import MyBookingDetailPage from "./pages/mypage/MyBookingDetailPage";
import MyReviewsPage from "./pages/mypage/MyReviewsPage";
import MyCouponsPage from "./pages/mypage/MyCouponsPage";
import MyPointsPage from "./pages/mypage/MyPointsPage";
import MyInquiriesPage from "./pages/mypage/MyInquiriesPage";

import FaqPage from "./pages/support/FaqPage";
import NoticeListPage from "./pages/support/NoticeListPage";
import NoticeDetailPage from "./pages/support/NoticeDetailPage";
import ContactPage from "./pages/support/ContactPage";

import NotFoundPage from "./pages/common/NotFoundPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 레이아웃 (헤더/푸터 포함) */}
        <Route path="/" element={<MainLayout />}>
          {/* 메인 홈 */}
          <Route index element={<HomePage />} />

          {/* 검색 / 리스트 */}
          <Route path="search" element={<SearchPage />} />
          <Route path="hotels">
            <Route index element={<HotelListPage />} />
            <Route path=":hotelId" element={<HotelDetailPage />} />
          </Route>

          {/* ✅ [수정] 찜하기 페이지를 여기(로그인 불필요 구역)로 이동 */}
          <Route path="wishlist" element={<WishlistPage />} />

          {/* ✅ [추가] Flight 페이지 */}
          <Route path="flights" element={<FlightSearchPage />} />

          {/* 고객센터 */}
          <Route path="support">
            <Route index element={<FaqPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="notices" element={<NoticeListPage />} />
            <Route path="notices/:noticeId" element={<NoticeDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
        </Route>

        {/* 예약 플로우 - 로그인 필요 */}
        <Route
          path="booking/:hotelId"
          element={
            <ProtectedRoute>
              <BookingStepLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BookingStepDates />} />
          <Route path="room" element={<BookingStepRoom />} />
          <Route path="extras" element={<BookingStepExtras />} />
          <Route path="payment" element={<BookingStepPayment />} />
          <Route path="complete" element={<BookingComplete />} />
        </Route>

        {/* 마이페이지 - 로그인 필요 */}
        <Route
          path="mypage"
          element={
            <ProtectedRoute>
              <MyPageLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyOverviewPage />} />
          <Route path="account" element={<MyAccountPage />} />
          <Route path="bookings">
            <Route index element={<MyBookingsPage />} />
            <Route path=":bookingId" element={<MyBookingDetailPage />} />
          </Route>
          <Route path="payment" element={<MyPaymentPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="reviews" element={<MyReviewsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="coupons" element={<MyCouponsPage />} />
          <Route path="points" element={<MyPointsPage />} />
          <Route path="inquiries" element={<MyInquiriesPage />} />
        </Route>

        {/* 인증 레이아웃 */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="verify-password-reset" element={<VerifyPasswordResetPage />} />
          <Route path="reset-password-confirm" element={<ResetPasswordConfirmPage />} />
          <Route path="add-payment" element={<AddPaymentPage />} />

          <Route path="oauth">
            <Route path="kakao/callback" element={<KakaoCallbackPage />} />
            <Route path="google/callback" element={<GoogleCallbackPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
