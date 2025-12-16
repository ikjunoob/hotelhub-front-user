import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";
import errorHandler from "./common/errorHandler.js";
import { successResponse } from "./common/response.js";

const app = express();

const allowedOrigins = (process.env.FRONT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, "")) // strip trailing slash to match browser origin exactly
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// 정적 파일 제공 (프론트엔드 public 폴더)
app.use(express.static("../frontend/public"));

app.use("/api", apiRoutes);

// 개발용: 테스트 데이터 생성
if (process.env.NODE_ENV !== "production") {
  app.post("/seed-data", async (_req, res) => {
    try {
      const { Hotel } = await import("./hotel/model.js");
      const { Room } = await import("./room/model.js");
      const { User } = await import("./user/model.js");

      // 기본 사용자 생성
      let owner = await User.findOne({ email: "owner@test.com" });
      if (!owner) {
        owner = await User.create({
          name: "Hotel Owner",
          email: "owner@test.com",
          password: "password123",
          phone: "010-1234-5678",
        });
      }

      // 호텔 데이터
      const hotelData = [
        // 서울
        { name: "샹그릴라 호텔 서울", city: "서울", address: "중구 장충단로 34", location: "장충동", basePrice: 150000, images: ["/images/hotel1.jpg", "/images/hotel2.jpg", "/images/hotel3.jpg"], coords: { lat: 37.5665, lng: 126.9780 } },
        { name: "롯데 호텔 서울", city: "서울", address: "중구 을지로 30", location: "을지로", basePrice: 180000, images: ["/images/hotel2.jpg", "/images/hotel3.jpg", "/images/hotel1.jpg"], coords: { lat: 37.5699, lng: 126.9933 } },
        { name: "조선 호텔", city: "서울", address: "중구 동호로 249", location: "명동", basePrice: 200000, images: ["/images/hotel3.jpg", "/images/hotel1.jpg", "/images/hotel2.jpg"], coords: { lat: 37.5628, lng: 126.9799 } },
        // 도쿄
        { name: "파크 하얏트 도쿄", city: "도쿄", address: "Minato-ku Akasaka", location: "아카사카", basePrice: 250000, images: ["/images/hotel1.jpg", "/images/hotel2.jpg", "/images/hotel3.jpg"], coords: { lat: 35.6762, lng: 139.7394 } },
        { name: "만다린 오리엔탈 도쿄", city: "도쿄", address: "Chiyoda-ku", location: "니혼바시", basePrice: 280000, images: ["/images/hotel2.jpg", "/images/hotel3.jpg", "/images/hotel1.jpg"], coords: { lat: 35.6744, lng: 139.7711 } },
        { name: "샹그릴라 도쿄", city: "도쿄", address: "Minato-ku", location: "오다이바", basePrice: 220000, images: ["/images/hotel3.jpg", "/images/hotel1.jpg", "/images/hotel2.jpg"], coords: { lat: 35.6295, lng: 139.7772 } },
        // 방콕
        { name: "만다린 오리엔탈 방콕", city: "방콕", address: "Bangkok, Thailand", location: "챠오프라야", basePrice: 120000, images: ["/images/hotel1.jpg", "/images/hotel2.jpg", "/images/hotel3.jpg"], coords: { lat: 13.7307, lng: 100.5209 } },
        { name: "앙코르 호텔", city: "방콕", address: "Bangkok, Thailand", location: "방콕", basePrice: 100000, images: ["/images/hotel2.jpg", "/images/hotel3.jpg", "/images/hotel1.jpg"], coords: { lat: 13.7563, lng: 100.5018 } },
        { name: "르 메리디앙 방콕", city: "방콕", address: "Bangkok, Thailand", location: "수쿰윗", basePrice: 110000, images: ["/images/hotel3.jpg", "/images/hotel1.jpg", "/images/hotel2.jpg"], coords: { lat: 13.7454, lng: 100.5631 } },
        // 호이안
        { name: "홍흐엉 호텔 호이안", city: "호이안", address: "Hoian, Vietnam", location: "올드타운", basePrice: 80000, images: ["/images/hotel1.jpg", "/images/hotel2.jpg", "/images/hotel3.jpg"], coords: { lat: 15.8801, lng: 108.3384 } },
        { name: "호이안 팰리스 리조트", city: "호이안", address: "Hoian, Vietnam", location: "해변", basePrice: 90000, images: ["/images/hotel2.jpg", "/images/hotel3.jpg", "/images/hotel1.jpg"], coords: { lat: 15.8833, lng: 108.3333 } },
        // 싱가포르
        { name: "마리나 베이 샌즈", city: "싱가포르", address: "10 Bayfront Avenue", location: "마리나 베이", basePrice: 300000, images: ["/images/hotel3.jpg", "/images/hotel1.jpg", "/images/hotel2.jpg"], coords: { lat: 1.2849, lng: 103.8629 } },
        // 필리핀
        { name: "아야 소피아 부티크 호텔", city: "보라카이", address: "Boracay, Philippines", location: "화이트 비치", basePrice: 70000, images: ["/images/hotel1.jpg", "/images/hotel2.jpg", "/images/hotel3.jpg"], coords: { lat: 11.9673, lng: 121.9278 } },
        // 홍콩
        { name: "더 페닌슐라 홍콩", city: "홍콩", address: "Hong Kong", location: "침샤추이", basePrice: 320000, images: ["/images/hotel2.jpg", "/images/hotel3.jpg", "/images/hotel1.jpg"], coords: { lat: 22.2959, lng: 114.1693 } },
        // 런던
        { name: "클래리지스 런던", city: "런던", address: "London, UK", location: "메이페어", basePrice: 350000, images: ["/images/hotel3.jpg", "/images/hotel1.jpg", "/images/hotel2.jpg"], coords: { lat: 51.5095, lng: -0.1441 } },
        // 파리
        { name: "르 무리스 파리", city: "파리", address: "Paris, France", location: "튈르리", basePrice: 340000, images: ["/images/hotel1.jpg", "/images/hotel2.jpg", "/images/hotel3.jpg"], coords: { lat: 48.8631, lng: 2.3297 } },
        // 뉴욕
        { name: "더 플라자 뉴욕", city: "뉴욕", address: "New York, USA", location: "센트럴 파크", basePrice: 400000, images: ["/images/hotel2.jpg", "/images/hotel3.jpg", "/images/hotel1.jpg"], coords: { lat: 40.7660, lng: -73.9776 } },
        // 두바이
        { name: "부르즈 알 아랍", city: "두바이", address: "Dubai, UAE", location: "주메이라", basePrice: 500000, images: ["/images/hotel3.jpg", "/images/hotel1.jpg", "/images/hotel2.jpg"], coords: { lat: 25.1413, lng: 55.1851 } },
        // 시드니
        { name: "파크 하얏트 시드니", city: "시드니", address: "Sydney, Australia", location: "서큘러 키", basePrice: 280000, images: ["/images/hotel1.jpg", "/images/hotel2.jpg", "/images/hotel3.jpg"], coords: { lat: -33.8568, lng: 151.2153 } },
        // 바르셀로나
        { name: "호텔 아트리움 팰리스", city: "바르셀로나", address: "Barcelona, Spain", location: "엑상플", basePrice: 200000, images: ["/images/hotel2.jpg", "/images/hotel3.jpg", "/images/hotel1.jpg"], coords: { lat: 41.3851, lng: 2.1734 } },
        // 밀라노
        { name: "호텔 루토", city: "밀라노", address: "Milan, Italy", location: "두오모", basePrice: 250000, images: ["/images/hotel3.jpg", "/images/hotel1.jpg", "/images/hotel2.jpg"], coords: { lat: 45.4642, lng: 9.1900 } },
        // 로마
        { name: "호텔 드 루산", city: "로마", address: "Rome, Italy", location: "스페인 광장", basePrice: 220000, images: ["/images/hotel1.jpg", "/images/hotel2.jpg", "/images/hotel3.jpg"], coords: { lat: 41.9009, lng: 12.4834 } },
        // 이스탄불
        { name: "네오패션 갤러리 호텔", city: "이스탄불", address: "Istanbul, Turkey", location: "술탄아흐멧", basePrice: 130000, images: ["/images/hotel2.jpg", "/images/hotel3.jpg", "/images/hotel1.jpg"], coords: { lat: 41.0052, lng: 28.9784 } },
      ];

      const hotels = await Hotel.insertMany(
        hotelData.map((h) => ({
          ...h,
          owner: owner._id,
          amenities: ["무료 WiFi", "에어컨", "객실 서비스", "피트니스"],
          ratingAverage: 4.5,
          ratingCount: 128,
          status: "approved",
          tags: ["호텔", "고급호텔"],
        }))
      );

      // 각 호텔별 객실 생성
      const rooms = [];
      for (const hotel of hotels) {
        rooms.push(
          {
            hotel: hotel._id,
            name: "싱글룸",
            type: "single",
            capacity: 1,
            price: hotel.basePrice,
            image: "/images/room1.jpg",
            amenities: ["에어컨", "WiFi", "욕실"],
            status: "active",
          },
          {
            hotel: hotel._id,
            name: "더블룸",
            type: "double",
            capacity: 2,
            price: hotel.basePrice + 30000,
            image: "/images/room2.jpg",
            amenities: ["에어컨", "WiFi", "욕실", "큰침대"],
            status: "active",
          },
          {
            hotel: hotel._id,
            name: "스위트룸",
            type: "suite",
            capacity: 4,
            price: hotel.basePrice + 80000,
            image: "/images/room3.jpg",
            amenities: ["에어컨", "WiFi", "욕실", "거실", "주방"],
            status: "active",
          },
          {
            hotel: hotel._id,
            name: "패밀리룸",
            type: "family",
            capacity: 6,
            price: hotel.basePrice + 120000,
            image: "/images/room4.jpg",
            amenities: ["에어컨", "WiFi", "욕실", "거실", "주방", "여러 침대"],
            status: "active",
          }
        );
      }

      await Room.insertMany(rooms);

      return res.status(200).json(
        successResponse(
          { hotels: hotels.length, rooms: rooms.length },
          "Seed data created successfully",
          200
        )
      );
    } catch (error) {
      console.error("Seed data error:", error);
      return res
        .status(500)
        .json(errorResponse(error.message, 500));
    }
  });
}

app.get("/health", (_req, res) => {
  res
    .status(200)
    .json(successResponse({ status: "ok" }, "Server is running!", 200));
});

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Server start failed:", err.message);
  process.exit(1);
});
