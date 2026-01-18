require('dotenv').config({ path: './.env' }); // Ensure .env is in backend folder
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);