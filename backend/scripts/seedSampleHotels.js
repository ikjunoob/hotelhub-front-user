import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Models are imported after env is loaded to ensure DB config is present
const { Hotel } = await import("../hotel/model.js");
const { User } = await import("../user/model.js");

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
const dbName = process.env.MONGO_DB_NAME;

if (!uri) {
  console.error("MongoDB URI (MONGO_URI or MONGODB_URI) is missing.");
  process.exit(1);
}

const sampleHotels = [
  {
    name: "부산 씨사이드 리조트",
    description: "해운대 인근 바다 전망 리조트",
    city: "부산",
    address: "부산광역시 해운대구 해운대해변로 270",
    location: "해운대해변로 270",
    basePrice: 180000,
    ratingAverage: 4.6,
    ratingCount: 120,
    tags: ["beach", "resort", "family"],
    amenities: ["무료 조식", "수영장", "스파", "무료 주차", "피트니스"],
    images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461"],
  },
  {
    name: "서울 스카이 파크 호텔",
    description: "도심 뷰와 루프탑 라운지를 갖춘 시티 호텔",
    city: "서울",
    address: "서울특별시 중구 을지로 30",
    location: "을지로 30",
    basePrice: 130000,
    ratingAverage: 4.2,
    ratingCount: 75,
    tags: ["city", "business"],
    amenities: ["무료 와이파이", "공항 셔틀", "피트니스", "비즈니스 센터"],
    images: ["https://images.unsplash.com/photo-1507676184212-d03ab07a01bf"],
  },
  {
    name: "강원 알프스 스파 호텔",
    description: "산과 계곡 전망의 온천 스파 호텔",
    city: "강릉",
    address: "강원특별자치도 강릉시 사천면 1번지",
    location: "강릉 사천면",
    basePrice: 210000,
    ratingAverage: 4.8,
    ratingCount: 54,
    tags: ["spa", "mountain", "quiet"],
    amenities: ["온천 스파", "무료 조식", "주차", "피트니스", "룸서비스"],
    images: ["https://images.unsplash.com/photo-1496417263034-38ec4f0b665a"],
  },
  {
    name: "제주 블루라군 풀빌라",
    description: "프라이빗 풀과 바비큐가 있는 럭셔리 풀빌라",
    city: "제주",
    address: "제주시 애월읍 바다전망길 88",
    location: "애월 바다전망길",
    basePrice: 250000,
    ratingAverage: 4.3,
    ratingCount: 33,
    tags: ["pool", "villa", "family"],
    amenities: ["전용 수영장", "바비큐 시설", "무료 주차", "주방", "해변 접근"],
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
  },
  {
    name: "대구 센트럴 비즈니스 호텔",
    description: "역세권 비즈니스 특화 호텔",
    city: "대구",
    address: "대구광역시 중구 중앙대로 100",
    location: "중앙대로 100",
    basePrice: 90000,
    ratingAverage: 3.9,
    ratingCount: 42,
    tags: ["business", "budget"],
    amenities: ["무료 와이파이", "주차", "비즈니스 라운지", "공항 셔틀"],
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"],
  },
];

async function ensureOwner() {
  let owner = await User.findOne({ email: "owner@test.com" });
  if (!owner) {
    owner = await User.create({
      name: "Sample Owner",
      email: "owner@test.com",
      password: "password123",
      phone: "01012345678",
      role: "owner",
    });
  }
  return owner;
}

async function main() {
  await mongoose.connect(uri, { dbName });
  const owner = await ensureOwner();

  for (const hotel of sampleHotels) {
    const exists = await Hotel.findOne({ name: hotel.name });
    if (exists) {
      console.log("Skip (exists):", hotel.name);
      continue;
    }
    await Hotel.create({
      ...hotel,
      owner: owner._id,
      status: "approved",
    });
    console.log("Inserted:", hotel.name);
  }
}

main()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error(err);
    mongoose.disconnect();
    process.exit(1);
  });
