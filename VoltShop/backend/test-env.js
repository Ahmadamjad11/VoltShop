// test-env.js
import dotenv from 'dotenv';

// قم بتهيئة dotenv
const result = dotenv.config();

// اطبع نتيجة التهيئة لمعرفة ما إذا كان قد وجد الملف
if (result.error) {
  console.log("❌ dotenv failed to find or parse the .env file. Error:", result.error);
} else {
  console.log("✅ dotenv loaded successfully. Parsed content:", result.parsed);
}

// الآن، حاول طباعة متغيرات Cloudinary مباشرة
console.log("\n--- Reading process.env ---");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);
console.log("---------------------------\n");

if (process.env.CLOUDINARY_CLOUD_NAME) {
    console.log("🎉 SUCCESS: The Cloudinary variables are accessible!");
} else {
    console.log("🔥 FAILURE: The Cloudinary variables are still undefined.");
}
