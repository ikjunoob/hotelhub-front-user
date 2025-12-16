// MongoDB 초기 데이터 삽입 스크립트
db = db.getSiblingDB("hotel-project");

// 기존 호텔 데이터 삭제
db.hotels.deleteMany({});

// 관리자 사용자 가져오기 (없으면 임시 사용자 생성)
let owner = db.users.findOne({ role: "admin" });
if (!owner) {
  owner = db.users.findOne();
}
const ownerId = owner ? owner._id : ObjectId();

db.hotels.insertMany([
  {
    name: "롯데호텔 서울",
    type: "hotel",
    city: "서울",
    address: "서울특별시 중구 을지로 30",
    location: "서울특별시 중구",
    description: "서울 중심부 명동에 위치한 5성급 호텔",
    ratingAverage: 4.5,
    ratingCount: 120,
    basePrice: 250000,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "수영장", "피트니스", "레스토랑", "주차장"],
    freebies: {
      breakfast: true,
      airportPickup: false,
      wifi: true,
      customerSupport: true,
    },
    owner: ownerId,
    status: "approved",
    tags: ["럭셔리", "비즈니스"],
    featured: true,
  },
  {
    name: "해운대 그랜드 호텔",
    type: "hotel",
    city: "부산",
    address: "부산광역시 해운대구 해운대해변로 296",
    location: "부산광역시 해운대구",
    description: "해운대 해변이 한눈에 보이는 오션뷰 호텔",
    ratingAverage: 4.3,
    ratingCount: 85,
    basePrice: 180000,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "오션뷰", "조식 포함", "주차장"],
    freebies: {
      breakfast: true,
      airportPickup: true,
      wifi: true,
      customerSupport: false,
    },
    owner: ownerId,
    status: "approved",
    tags: ["오션뷰", "가족여행"],
    featured: true,
  },
  {
    name: "제주 신라호텔",
    type: "resort",
    city: "제주",
    address: "제주특별자치도 서귀포시 중문관광로 72번길 75",
    location: "제주특별자치도 서귀포시",
    description: "제주 중문 리조트에 위치한 럭셔리 호텔",
    ratingAverage: 4.7,
    ratingCount: 200,
    basePrice: 320000,
    freebies: {
      breakfast: true,
      airportPickup: true,
      wifi: true,
      customerSupport: true,
    },
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "스파", "골프장", "해변 접근", "키즈클럽"],
    owner: ownerId,
    status: "approved",
    tags: ["럭셔리", "리조트", "신혼여행"],
    featured: true,
  },
  {
    name: "강릉 씨마크호텔",
    type: "hotel",
    city: "강릉",
    address: "강원특별자치도 강릉시 창해로 307",
    location: "강원특별자치도 강릉시",
    description: "동해바다를 마주한 힐링 호텔",
    ratingAverage: 4.4,
    ratingCount: 95,
    basePrice: 160000,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "오션뷰", "조식 포함", "주차장", "사우나"],
    owner: ownerId,
    status: "approved",
    tags: ["오션뷰", "힐링", "커플"],
    featured: true,
  },
  {
    name: "서울 파크하얏트",
    type: "hotel",
    city: "서울",
    address: "서울특별시 강남구 테헤란로 606",
    location: "서울특별시 강남구",
    description: "강남 중심부의 프리미엄 비즈니스 호텔",
    ratingAverage: 4.6,
    ratingCount: 150,
    basePrice: 280000,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    amenities: [
      "무료 WiFi",
      "루프탑 바",
      "피트니스",
      "비즈니스 센터",
      "발렛파킹",
    ],
    owner: ownerId,
    status: "approved",
    tags: ["럭셔리", "비즈니스", "강남"],
    featured: true,
  },
  {
    name: "부산 웨스틴 조선",
    type: "hotel",
    city: "부산",
    address: "부산광역시 중구 중구로 67",
    location: "부산광역시 중구",
    description: "부산의 랜드마크 럭셔리 호텔",
    ratingAverage: 4.5,
    ratingCount: 110,
    basePrice: 220000,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "실내수영장", "스파", "레스토랑", "주차장"],
    owner: ownerId,
    status: "approved",
    tags: ["럭셔리", "비즈니스", "역사"],
    featured: true,
  },
  {
    name: "여수 히든베이호텔",
    type: "hotel",
    city: "여수",
    address: "전라남도 여수시 돌산읍 무슬목길 142",
    location: "전라남도 여수시",
    description: "여수 밤바다가 보이는 낭만 호텔",
    ratingAverage: 4.6,
    ratingCount: 88,
    basePrice: 190000,
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "오션뷰", "루프탑", "조식 포함", "주차장"],
    owner: ownerId,
    status: "approved",
    tags: ["오션뷰", "낭만", "커플"],
    featured: true,
  },
  {
    name: "경주 코모도호텔",
    type: "resort",
    city: "경주",
    address: "경상북도 경주시 보문로 424-7",
    location: "경상북도 경주시",
    description: "보문단지 내 호수가 보이는 리조트 호텔",
    ratingAverage: 4.2,
    ratingCount: 75,
    basePrice: 140000,
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "수영장", "자전거 대여", "조식 포함", "주차장"],
    owner: ownerId,
    status: "approved",
    tags: ["가족여행", "문화", "힐링"],
    featured: false,
  },
  {
    name: "전주 한옥마을 게스트하우스",
    type: "motel",
    city: "전주",
    address: "전라북도 전주시 완산구 은행로 34",
    location: "전라북도 전주시",
    description: "전통 한옥 스타일의 게스트하우스",
    ratingAverage: 4.3,
    ratingCount: 62,
    basePrice: 80000,
    freebies: {
      breakfast: true,
      airportPickup: false,
      wifi: true,
      customerSupport: false,
    },
    images: [
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "한옥 체험", "전통 조식", "주차장"],
    owner: ownerId,
    status: "approved",
    tags: ["한옥", "전통", "가족여행"],
    featured: false,
  },
  {
    name: "인천 파라다이스 시티",
    type: "resort",
    city: "인천",
    address: "인천광역시 중구 영종해안남로321번길 186",
    location: "인천광역시 중구",
    description: "공항 근처의 복합 리조트 호텔",
    ratingAverage: 4.7,
    ratingCount: 180,
    basePrice: 350000,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "카지노", "스파", "수영장", "쇼핑몰", "무료 셔틀"],
    owner: ownerId,
    status: "approved",
    tags: ["럭셔리", "리조트", "카지노"],
    featured: true,
  },
  // 추가 모텔 데이터
  {
    name: "서울 강남 비즈니스 모텔",
    type: "motel",
    city: "서울",
    address: "서울특별시 강남구 논현로 123",
    location: "서울특별시 강남구",
    description: "강남역 인근의 깨끗하고 편리한 비즈니스 모텔",
    ratingAverage: 4.0,
    ratingCount: 45,
    basePrice: 60000,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "주차장", "24시간 체크인", "케이블TV"],
    owner: ownerId,
    status: "approved",
    tags: ["비즈니스", "강남", "단기숙박"],
    featured: false,
  },
  {
    name: "부산 광안리 씨뷰 모텔",
    type: "motel",
    city: "부산",
    address: "부산광역시 수영구 광안해변로 45",
    location: "부산광역시 수영구",
    description: "광안리 해변 바로 앞 오션뷰 모텔",
    ratingAverage: 4.2,
    ratingCount: 67,
    basePrice: 75000,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "오션뷰", "주차장", "24시간 체크인"],
    owner: ownerId,
    status: "approved",
    tags: ["오션뷰", "광안리", "커플"],
    featured: false,
  },
  {
    name: "제주 애월 힐링 모텔",
    type: "motel",
    city: "제주",
    address: "제주특별자치도 제주시 애월읍 애월해안로 234",
    location: "제주특별자치도 제주시",
    description: "애월 해안도로 인근의 조용한 힐링 모텔",
    ratingAverage: 4.1,
    ratingCount: 52,
    basePrice: 70000,
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "주차장", "전기차 충전소", "조식 제공"],
    owner: ownerId,
    status: "approved",
    tags: ["힐링", "제주", "애월"],
    featured: false,
  },
  {
    name: "대전 유성 온천 모텔",
    type: "motel",
    city: "대전",
    address: "대전광역시 유성구 온천로 567",
    location: "대전광역시 유성구",
    description: "천연 온천수를 사용하는 온천 모텔",
    ratingAverage: 4.3,
    ratingCount: 89,
    basePrice: 65000,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "온천", "주차장", "사우나"],
    owner: ownerId,
    status: "approved",
    tags: ["온천", "힐링", "유성"],
    featured: false,
  },
  {
    name: "속초 해변 모텔",
    type: "motel",
    city: "속초",
    address: "강원특별자치도 속초시 해오름로 890",
    location: "강원특별자치도 속초시",
    description: "속초 해수욕장 인근의 가성비 좋은 모텔",
    ratingAverage: 3.9,
    ratingCount: 38,
    basePrice: 55000,
    images: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
    ],
    amenities: ["무료 WiFi", "주차장", "24시간 체크인"],
    owner: ownerId,
    status: "approved",
    tags: ["해변", "가성비", "속초"],
    featured: false,
  },
  // 추가 리조트 데이터
  {
    name: "평창 알펜시아 리조트",
    type: "resort",
    city: "평창",
    address: "강원특별자치도 평창군 대관령면 솔봉로 325",
    location: "강원특별자치도 평창군",
    description: "대관령의 사계절 종합 리조트",
    ratingAverage: 4.6,
    ratingCount: 234,
    basePrice: 280000,
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
    ],
    amenities: [
      "무료 WiFi",
      "스키장",
      "골프장",
      "수영장",
      "스파",
      "키즈클럽",
      "레스토랑",
    ],
    owner: ownerId,
    status: "approved",
    tags: ["스키", "골프", "가족여행", "리조트"],
    featured: true,
  },
  {
    name: "남해 힐튼 리조트",
    type: "resort",
    city: "남해",
    address: "경상남도 남해군 남해읍 남해대로 1234",
    location: "경상남도 남해군",
    description: "한려수도가 한눈에 보이는 프리미엄 리조트",
    ratingAverage: 4.5,
    ratingCount: 178,
    basePrice: 260000,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
    ],
    amenities: [
      "무료 WiFi",
      "오션뷰",
      "수영장",
      "스파",
      "레스토랑",
      "바비큐장",
    ],
    owner: ownerId,
    status: "approved",
    tags: ["오션뷰", "힐링", "리조트", "남해"],
    featured: true,
  },
  {
    name: "보령 머드 스파 리조트",
    type: "resort",
    city: "보령",
    address: "충청남도 보령시 대천해수욕장길 567",
    location: "충청남도 보령시",
    description: "보령 머드로 유명한 테라피 리조트",
    ratingAverage: 4.4,
    ratingCount: 145,
    basePrice: 180000,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&h=600&fit=crop",
    ],
    amenities: [
      "무료 WiFi",
      "머드스파",
      "사우나",
      "수영장",
      "레스토랑",
      "주차장",
    ],
    owner: ownerId,
    status: "approved",
    tags: ["스파", "힐링", "보령머드", "가족여행"],
    featured: false,
  },
  {
    name: "양양 서피비치 리조트",
    type: "resort",
    city: "양양",
    address: "강원특별자치도 양양군 현남면 하조대해안길 119",
    location: "강원특별자치도 양양군",
    description: "서핑과 해변을 즐기는 액티비티 리조트",
    ratingAverage: 4.3,
    ratingCount: 167,
    basePrice: 190000,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    ],
    amenities: [
      "무료 WiFi",
      "서핑레슨",
      "비치바",
      "바비큐장",
      "주차장",
      "자전거 대여",
    ],
    owner: ownerId,
    status: "approved",
    tags: ["서핑", "해변", "액티비티", "젊은층"],
    featured: false,
  },
  {
    name: "가평 에덴밸리 리조트",
    type: "resort",
    city: "가평",
    address: "경기도 가평군 청평면 고재길 226",
    location: "경기도 가평군",
    description: "서울 근교의 스키와 골프를 즐기는 리조트",
    ratingAverage: 4.2,
    ratingCount: 198,
    basePrice: 170000,
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
    ],
    amenities: [
      "무료 WiFi",
      "스키장",
      "골프장",
      "수영장",
      "레스토랑",
      "키즈클럽",
    ],
    owner: ownerId,
    status: "approved",
    tags: ["스키", "골프", "가족여행", "서울근교"],
    featured: false,
  },
]);

print("✅ Hotels inserted:", db.hotels.countDocuments());

// 호텔 ID 가져오기
const hotels = db.hotels.find().toArray();
const hotel1 = hotels[0]._id; // 롯데호텔 서울
const hotel2 = hotels[1]._id; // 해운대 그랜드 호텔
const hotel3 = hotels[2]._id; // 제주 신라호텔

// ===== Rooms 데이터 삽입 =====
db.rooms.deleteMany({});

db.rooms.insertMany([
  // 롯데호텔 서울 객실
  {
    hotel: hotel1,
    name: "디럭스 더블룸",
    type: "더블",
    price: 250000,
    capacity: 2,
    inventory: 10,
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
    ],
    amenities: ["킹 베드", "시티뷰", "무료 WiFi", "미니바", "욕조"],
    status: "active",
  },
  {
    hotel: hotel1,
    name: "이그제큐티브 스위트",
    type: "스위트",
    price: 450000,
    capacity: 4,
    inventory: 5,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
    ],
    amenities: ["킹 베드", "거실", "시티뷰", "무료 WiFi", "욕조", "네스프레소"],
    status: "active",
  },
  {
    hotel: hotel1,
    name: "스탠다드 트윈룸",
    type: "트윈",
    price: 220000,
    capacity: 2,
    inventory: 15,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop",
    ],
    amenities: ["트윈 베드", "무료 WiFi", "미니바", "샤워부스"],
    status: "active",
  },

  // 해운대 그랜드 호텔 객실
  {
    hotel: hotel2,
    name: "오션뷰 더블룸",
    type: "더블",
    price: 180000,
    capacity: 2,
    inventory: 12,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    ],
    amenities: ["킹 베드", "오션뷰", "발코니", "무료 WiFi", "욕조"],
    status: "active",
  },
  {
    hotel: hotel2,
    name: "패밀리 스위트",
    type: "스위트",
    price: 320000,
    capacity: 4,
    inventory: 8,
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&h=600&fit=crop",
    ],
    amenities: ["킹 베드", "소파베드", "오션뷰", "발코니", "주방", "세탁기"],
    status: "active",
  },
  {
    hotel: hotel2,
    name: "스탠다드 시티뷰",
    type: "더블",
    price: 150000,
    capacity: 2,
    inventory: 20,
    images: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    ],
    amenities: ["퀸 베드", "시티뷰", "무료 WiFi", "샤워부스"],
    status: "active",
  },

  // 제주 신라호텔 객실
  {
    hotel: hotel3,
    name: "프리미엄 오션뷰",
    type: "더블",
    price: 320000,
    capacity: 2,
    inventory: 15,
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    ],
    amenities: [
      "킹 베드",
      "오션뷰",
      "발코니",
      "무료 WiFi",
      "욕조",
      "네스프레소",
    ],
    status: "active",
  },
  {
    hotel: hotel3,
    name: "로얄 스위트",
    type: "스위트",
    price: 650000,
    capacity: 4,
    inventory: 3,
    images: [
      "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    ],
    amenities: [
      "킹 베드",
      "거실",
      "오션뷰",
      "프라이빗 풀",
      "욕조",
      "네스프레소",
      "버틀러 서비스",
    ],
    status: "active",
  },
  {
    hotel: hotel3,
    name: "가든뷰 트윈룸",
    type: "트윈",
    price: 280000,
    capacity: 2,
    inventory: 18,
    images: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
    ],
    amenities: ["트윈 베드", "가든뷰", "발코니", "무료 WiFi", "욕조"],
    status: "active",
  },
]);

print("✅ Rooms inserted:", db.rooms.countDocuments());

// 객실 ID 가져오기
const rooms = db.rooms.find().toArray();

// 사용자 가져오기 (리뷰 작성자)
const user = db.users.findOne() || { _id: ObjectId() };
const userId = user._id;

// ===== Reservations 데이터 삽입 (리뷰를 위한 완료된 예약) =====
db.reservations.deleteMany({});

const reservations = db.reservations.insertMany([
  {
    userId: userId,
    hotelId: hotel1,
    roomId: rooms[0]._id,
    checkIn: new Date("2024-11-01"),
    checkOut: new Date("2024-11-03"),
    guests: 2,
    totalPrice: 500000,
    status: "completed",
  },
  {
    userId: userId,
    hotelId: hotel1,
    roomId: rooms[1]._id,
    checkIn: new Date("2024-10-15"),
    checkOut: new Date("2024-10-17"),
    guests: 2,
    totalPrice: 900000,
    status: "completed",
  },
  {
    userId: userId,
    hotelId: hotel2,
    roomId: rooms[3]._id,
    checkIn: new Date("2024-11-10"),
    checkOut: new Date("2024-11-12"),
    guests: 2,
    totalPrice: 360000,
    status: "completed",
  },
  {
    userId: userId,
    hotelId: hotel2,
    roomId: rooms[4]._id,
    checkIn: new Date("2024-10-20"),
    checkOut: new Date("2024-10-22"),
    guests: 4,
    totalPrice: 640000,
    status: "completed",
  },
  {
    userId: userId,
    hotelId: hotel3,
    roomId: rooms[6]._id,
    checkIn: new Date("2024-11-15"),
    checkOut: new Date("2024-11-17"),
    guests: 2,
    totalPrice: 640000,
    status: "completed",
  },
  {
    userId: userId,
    hotelId: hotel3,
    roomId: rooms[8]._id,
    checkIn: new Date("2024-10-25"),
    checkOut: new Date("2024-10-27"),
    guests: 2,
    totalPrice: 560000,
    status: "completed",
  },
]);

print("✅ Reservations inserted:", db.reservations.countDocuments());

// 예약 ID 가져오기
const completedReservations = db.reservations
  .find({ status: "completed" })
  .toArray();

// ===== Reviews 데이터 삽입 =====
db.reviews.deleteMany({});

db.reviews.insertMany([
  {
    userId: userId,
    hotelId: hotel1,
    reservationId: completedReservations[0]._id,
    rating: 5,
    comment:
      "위치도 좋고 시설도 깨끗했어요. 직원분들도 친절하셨습니다. 다음에 또 이용하고 싶어요!",
    images: [],
  },
  {
    userId: userId,
    hotelId: hotel1,
    reservationId: completedReservations[1]._id,
    rating: 4,
    comment:
      "스위트룸이 정말 넓고 좋았습니다. 조식도 훌륭했어요. 단, 주차장이 협소한 것이 아쉬웠습니다.",
    images: [],
  },
  {
    userId: userId,
    hotelId: hotel2,
    reservationId: completedReservations[2]._id,
    rating: 5,
    comment:
      "오션뷰가 정말 환상적이었습니다! 해변 접근도 쉽고 가족 여행하기 좋았어요.",
    images: [],
  },
  {
    userId: userId,
    hotelId: hotel2,
    reservationId: completedReservations[3]._id,
    rating: 4,
    comment:
      "패밀리 스위트가 넓어서 아이들과 지내기 좋았습니다. 주방이 있어서 편리했어요.",
    images: [],
  },
  {
    userId: userId,
    hotelId: hotel3,
    reservationId: completedReservations[4]._id,
    rating: 5,
    comment:
      "제주 여행의 하이라이트였습니다. 리조트 시설이 최고였고, 오션뷰가 정말 아름다웠어요!",
    images: [],
  },
  {
    userId: userId,
    hotelId: hotel3,
    reservationId: completedReservations[5]._id,
    rating: 5,
    comment:
      "가든뷰도 예쁘고 조용해서 휴식하기 좋았습니다. 스파도 최고였어요. 강추!",
    images: [],
  },
]);

print("✅ Reviews inserted:", db.reviews.countDocuments());

// ===== Tours 데이터 삽입 =====
db.tours.deleteMany({});

db.tours.insertMany([
  {
    name: "서울 역사 탐방 투어",
    description:
      "경복궁, 창덕궁, 북촌 한옥마을을 둘러보며 서울의 역사와 문화를 체험하는 투어입니다.",
    city: "서울",
    country: "대한민국",
    duration: 1,
    price: 85000,
    maxGroupSize: 15,
    difficulty: "easy",
    images: [
      "https://images.unsplash.com/photo-1549694933-e983625e1f69?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop",
    ],
    includedServices: [
      "전문 가이드",
      "입장료",
      "점심식사",
      "교통편",
      "생수 제공",
    ],
    excludedServices: ["개인 경비", "여행자 보험"],
    itinerary: [
      {
        day: 1,
        title: "서울 역사 명소 탐방",
        description: "경복궁부터 북촌 한옥마을까지 서울의 역사를 한눈에",
        activities: [
          "경복궁 관람 및 수문장 교대식",
          "창덕궁 후원 산책",
          "북촌 한옥마을 탐방",
          "전통 찻집에서 티타임",
        ],
      },
    ],
    startDates: [
      new Date("2025-01-15"),
      new Date("2025-02-01"),
      new Date("2025-03-01"),
      new Date("2025-04-01"),
    ],
    ratingAverage: 4.8,
    ratingCount: 156,
    category: "historical",
    guide: userId,
    status: "active",
    tags: ["문화", "역사", "한옥"],
  },
  {
    name: "제주 올레길 트레킹",
    description:
      "제주의 아름다운 자연을 걸으며 힐링하는 2일 올레길 트레킹 투어입니다.",
    city: "제주",
    country: "대한민국",
    duration: 2,
    price: 240000,
    maxGroupSize: 12,
    difficulty: "moderate",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571498664957-fde285d79857?w=800&h=600&fit=crop",
    ],
    includedServices: [
      "전문 트레킹 가이드",
      "2일 숙박",
      "전 일정 식사",
      "교통편",
      "올레길 스탬프북",
    ],
    excludedServices: ["개인 장비", "여행자 보험"],
    itinerary: [
      {
        day: 1,
        title: "제주 올레 7코스",
        description: "외돌개부터 월평포구까지",
        activities: [
          "외돌개 출발",
          "중문 해변 산책",
          "천제연폭포 관람",
          "월평포구 도착",
        ],
      },
      {
        day: 2,
        title: "제주 올레 8코스",
        description: "월평포구에서 대평포구까지",
        activities: [
          "월평포구 출발",
          "법환포구 휴식",
          "섶섬 전망",
          "대평포구 도착 및 해산",
        ],
      },
    ],
    startDates: [
      new Date("2025-01-20"),
      new Date("2025-02-15"),
      new Date("2025-03-10"),
      new Date("2025-04-05"),
    ],
    ratingAverage: 4.9,
    ratingCount: 203,
    category: "nature",
    guide: userId,
    status: "active",
    tags: ["트레킹", "자연", "힐링"],
  },
  {
    name: "부산 야경 & 미식 투어",
    description:
      "부산의 아름다운 야경과 해산물 맛집을 즐기는 특별한 저녁 투어입니다.",
    city: "부산",
    country: "대한민국",
    duration: 1,
    price: 95000,
    maxGroupSize: 10,
    difficulty: "easy",
    images: [
      "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582128244305-dbe42d4f261e?w=800&h=600&fit=crop",
    ],
    includedServices: ["푸드 가이드", "저녁식사", "교통편", "생수 제공"],
    excludedServices: ["추가 음식", "개인 경비"],
    itinerary: [
      {
        day: 1,
        title: "부산 야경과 맛집 탐방",
        description: "광안리부터 자갈치시장까지",
        activities: [
          "광안대교 야경 감상",
          "해운대 해변 산책",
          "자갈치시장 회 코스",
          "송정 카페거리",
        ],
      },
    ],
    startDates: [
      new Date("2025-01-10"),
      new Date("2025-02-05"),
      new Date("2025-03-05"),
      new Date("2025-04-10"),
    ],
    ratingAverage: 4.7,
    ratingCount: 142,
    category: "food",
    guide: userId,
    status: "active",
    tags: ["야경", "맛집", "해산물"],
  },
  {
    name: "강원도 설악산 등산",
    description:
      "설악산의 웅장한 산세를 오르며 자연을 만끽하는 2박 3일 등산 투어입니다.",
    city: "속초",
    country: "대한민국",
    duration: 3,
    price: 380000,
    maxGroupSize: 10,
    difficulty: "difficult",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=600&fit=crop",
    ],
    includedServices: [
      "전문 산악 가이드",
      "2박 산장 숙박",
      "전 일정 식사",
      "등산 장비 대여",
      "교통편",
    ],
    excludedServices: ["개인 장비", "간식", "여행자 보험"],
    itinerary: [
      {
        day: 1,
        title: "설악산 입구 ~ 중청",
        description: "설악산 입구에서 중청대피소까지",
        activities: ["오색입구 출발", "대승령 경유", "중청대피소 도착 및 숙박"],
      },
      {
        day: 2,
        title: "중청 ~ 대청봉 ~ 백담사",
        description: "대청봉 정상 등정 및 하산",
        activities: [
          "중청대피소 출발",
          "대청봉 정상 등정",
          "희운각대피소 휴식",
          "백담사 도착 및 숙박",
        ],
      },
      {
        day: 3,
        title: "백담사 ~ 용대리",
        description: "백담사에서 하산 및 투어 종료",
        activities: ["백담사 출발", "백담계곡 하산", "용대리 도착 및 해산"],
      },
    ],
    startDates: [
      new Date("2025-05-01"),
      new Date("2025-06-01"),
      new Date("2025-09-01"),
      new Date("2025-10-01"),
    ],
    ratingAverage: 4.6,
    ratingCount: 89,
    category: "adventure",
    guide: userId,
    status: "active",
    tags: ["등산", "설악산", "자연"],
  },
  {
    name: "경주 문화재 일주",
    description:
      "천년 고도 경주의 유네스코 세계문화유산을 돌아보는 1일 투어입니다.",
    city: "경주",
    country: "대한민국",
    duration: 1,
    price: 78000,
    maxGroupSize: 20,
    difficulty: "easy",
    images: [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&h=600&fit=crop",
    ],
    includedServices: [
      "문화해설사",
      "입장료",
      "점심식사",
      "교통편",
      "생수 제공",
    ],
    excludedServices: ["개인 경비", "기념품"],
    itinerary: [
      {
        day: 1,
        title: "경주 역사유적 탐방",
        description: "불국사부터 첨성대까지",
        activities: [
          "불국사 관람",
          "석굴암 방문",
          "대릉원 산책",
          "첨성대 및 동궁과 월지",
        ],
      },
    ],
    startDates: [
      new Date("2025-01-25"),
      new Date("2025-02-20"),
      new Date("2025-03-15"),
      new Date("2025-04-20"),
    ],
    ratingAverage: 4.5,
    ratingCount: 178,
    category: "cultural",
    guide: userId,
    status: "active",
    tags: ["문화재", "역사", "유네스코"],
  },
  {
    name: "전주 한옥마을 & 맛집 투어",
    description: "전주의 전통과 맛을 동시에 즐기는 특별한 1일 투어입니다.",
    city: "전주",
    country: "대한민국",
    duration: 1,
    price: 72000,
    maxGroupSize: 15,
    difficulty: "easy",
    images: [
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    ],
    includedServices: ["로컬 가이드", "한복 체험", "점심 & 저녁식사", "교통편"],
    excludedServices: ["추가 음식", "개인 경비"],
    itinerary: [
      {
        day: 1,
        title: "전주 한옥마을과 맛집 탐방",
        description: "한옥마을부터 남부시장까지",
        activities: [
          "한옥마을 한복 체험",
          "경기전 관람",
          "전주비빔밥 점심",
          "남부시장 야시장 투어",
        ],
      },
    ],
    startDates: [
      new Date("2025-01-18"),
      new Date("2025-02-12"),
      new Date("2025-03-08"),
      new Date("2025-04-15"),
    ],
    ratingAverage: 4.8,
    ratingCount: 234,
    category: "food",
    guide: userId,
    status: "active",
    tags: ["한옥", "전통", "맛집", "비빔밥"],
  },
]);

print("✅ Tours inserted:", db.tours.countDocuments());

// ===== Favorites 데이터 삽입 =====
db.favorites.deleteMany({});

// 사용자와 호텔 데이터 조회
const allUsers = db.users.find().toArray();
const allHotels = db.hotels.find().toArray();

if (allUsers.length > 0 && allHotels.length > 0) {
  const favoritesData = [];

  // 첫 번째 사용자가 여러 호텔을 찜
  if (allUsers[0] && allHotels.length >= 5) {
    favoritesData.push(
      {
        userId: allUsers[0]._id,
        hotelId: allHotels[0]._id, // 롯데호텔 서울
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: allUsers[0]._id,
        hotelId: allHotels[2]._id, // 제주 신라호텔
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: allUsers[0]._id,
        hotelId: allHotels[4]._id, // 서울 파크하얏트
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: allUsers[0]._id,
        hotelId: allHotels[6]._id, // 여수 히든베이호텔
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: allUsers[0]._id,
        hotelId: allHotels[9]._id, // 인천 파라다이스 시티
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
  }

  // 두 번째 사용자가 있다면 일부 호텔 찜
  if (allUsers.length > 1 && allHotels.length >= 3) {
    favoritesData.push(
      {
        userId: allUsers[1]._id,
        hotelId: allHotels[1]._id, // 해운대 그랜드 호텔
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: allUsers[1]._id,
        hotelId: allHotels[3]._id, // 강릉 씨마크호텔
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
  }

  if (favoritesData.length > 0) {
    db.favorites.insertMany(favoritesData);
    print("✅ Favorites inserted:", db.favorites.countDocuments());
  }
}

print("🎉 Initial data setup completed!");
