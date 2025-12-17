import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Load models after env is ready
const { Hotel } = await import("../hotel/model.js");
const { Room } = await import("../room/model.js");

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
const dbName = process.env.MONGO_DB_NAME;

if (!uri) {
  console.error("MongoDB URI (MONGO_URI or MONGODB_URI) is missing.");
  process.exit(1);
}

const sampleRooms = [
  {
    hotelName: "부산 씨사이드 리조트",
    rooms: [
      {
        name: "오션뷰 스탠다드",
        type: "standard",
        price: 120000,
        capacity: 2,
        inventory: 5,
        amenities: ["바다 전망", "조식 포함", "무료 와이파이"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
      {
        name: "패밀리 스위트",
        type: "suite",
        price: 220000,
        capacity: 4,
        inventory: 3,
        amenities: ["거실", "욕조", "수영장 이용"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
      {
        name: "테라스 풀 빌라",
        type: "villa",
        price: 350000,
        capacity: 6,
        inventory: 2,
        amenities: ["개인 풀", "테라스", "바비큐 시설"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
    ],
  },
  {
    hotelName: "서울 스카이 파크 호텔",
    rooms: [
      {
        name: "비즈니스 더블",
        type: "double",
        price: 110000,
        capacity: 2,
        inventory: 6,
        amenities: ["업무용 데스크", "무료 와이파이"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
      {
        name: "디럭스 트윈",
        type: "twin",
        price: 140000,
        capacity: 3,
        inventory: 4,
        amenities: ["라운지 이용", "피트니스"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
      {
        name: "이그제큐티브 스위트",
        type: "suite",
        price: 200000,
        capacity: 4,
        inventory: 2,
        amenities: ["라운지", "욕조", "조식 포함"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
    ],
  },
  {
    hotelName: "강원 알프스 스파 호텔",
    rooms: [
      {
        name: "온천 스탠다드",
        type: "standard",
        price: 160000,
        capacity: 2,
        inventory: 4,
        amenities: ["온천 스파", "산 전망"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
      {
        name: "마운틴뷰 디럭스",
        type: "deluxe",
        price: 190000,
        capacity: 3,
        inventory: 3,
        amenities: ["산 전망", "조식 포함"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
      {
        name: "패밀리 온천 스위트",
        type: "suite",
        price: 260000,
        capacity: 4,
        inventory: 2,
        amenities: ["온천 스파", "거실", "조식 포함"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
    ],
  },
  {
    hotelName: "제주 블루라군 풀빌라",
    rooms: [
      {
        name: "가든 풀빌라",
        type: "villa",
        price: 280000,
        capacity: 4,
        inventory: 3,
        amenities: ["개인 풀", "정원", "바비큐 시설"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
      {
        name: "오션뷰 풀빌라",
        type: "villa",
        price: 340000,
        capacity: 6,
        inventory: 2,
        amenities: ["바다 전망", "개인 풀", "주방"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
      {
        name: "프라이빗 하우스",
        type: "villa",
        price: 420000,
        capacity: 8,
        inventory: 1,
        amenities: ["독채", "야외 풀", "바비큐 시설"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
    ],
  },
  {
    hotelName: "대구 센트럴 비즈니스 호텔",
    rooms: [
      {
        name: "스탠다드 싱글",
        type: "single",
        price: 80000,
        capacity: 1,
        inventory: 8,
        amenities: ["업무용 데스크", "무료 와이파이"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
      {
        name: "스탠다드 더블",
        type: "double",
        price: 90000,
        capacity: 2,
        inventory: 6,
        amenities: ["조식 포함", "무료 주차"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
      {
        name: "비즈니스 스위트",
        type: "suite",
        price: 130000,
        capacity: 3,
        inventory: 3,
        amenities: ["라운지 이용", "업무용 데스크"],
        images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
      },
    ],
  },
];

async function main() {
  await mongoose.connect(uri, { dbName });

  let inserted = 0;
  for (const { hotelName, rooms } of sampleRooms) {
    const hotel = await Hotel.findOne({ name: hotelName });
    if (!hotel) {
      console.warn("Skip (hotel not found):", hotelName);
      continue;
    }

    for (const room of rooms) {
      const exists = await Room.findOne({ hotel: hotel._id, name: room.name });
      if (exists) {
        console.log("Skip (exists):", room.name, "in", hotelName);
        continue;
      }
      await Room.create({ ...room, hotel: hotel._id, status: "active" });
      inserted += 1;
      console.log("Inserted:", room.name, "in", hotelName);
    }
  }

  console.log("Done. Inserted rooms:", inserted);
}

main()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error(err);
    mongoose.disconnect();
    process.exit(1);
  });
