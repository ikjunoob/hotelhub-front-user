import mongoose from "mongoose";

// --- 환경 변수 설정 ---
// 환경 변수에서 URI를 가져오거나, 없을 경우 오류를 출력합니다.
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || "hotel-project";
console.log(`[DEBUG] Final URI being used: ${uri}`); // 🌟 이 줄을 추가합니다.
// URI가 없으면 즉시 종료
if (!uri) {
  console.error("🚨 MongoDB URI (MONGO_URI or MONGODB_URI) is missing. Please check your docker-compose or .env file.");
  process.exit(1);
}

// Single shared connection for all models
// 5초 타임아웃을 설정합니다.
export const dbConnection = mongoose.createConnection(uri, {
  serverSelectionTimeoutMS: 5000,
  dbName,
});

// --- 재시도 로직 설정 ---
const MAX_RETRIES = 10;   // 최대 재시도 횟수
const RETRY_DELAY = 3000; // 3초 대기 후 재시도 (Docker 네트워크 안정화를 위해 충분한 시간을 줍니다)

/**
 * MongoDB 연결을 시도하고, 실패 시 재귀적으로 재시도합니다.
 * @param {number} retries 현재 시도 횟수
 */
export const connectDB = async (retries = 0) => {
  try {
    // asPromise()를 사용하여 연결이 확립될 때까지 대기
    await dbConnection.asPromise();
    console.log(`✅ MongoDB connection ready (${dbName})`);
  } catch (err) {
    // 🌟 재시도 조건: 최대 횟수를 초과하지 않은 경우
    if (retries < MAX_RETRIES) {
      console.error(
        `❌ MongoDB Connection Failed: ${err.message}. Retrying in ${RETRY_DELAY / 1000}s... (Attempt ${retries + 1}/${MAX_RETRIES})`
      );
      
      // 지정된 시간만큼 비동기적으로 대기
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      
      // 다음 시도
      await connectDB(retries + 1);
      
    } else {
      // 🌟 최대 횟수 초과 시 최종 종료
      console.error("🚨 MongoDB Connection Failed: Max retries exceeded. Application shutting down.");
      console.error(`Error details: ${err.message}`);
      process.exit(1);
    }
  }
};