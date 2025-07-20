import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';

const s3 = new S3Client({
  region: process.env.AWSS_REGION,
  credentials: {
    accessKeyId: process.env.AWSS_OPEN_KEY,
    secretAccessKey: process.env.AWSS_SEC_KEY,
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `courses/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

const uploadInstitutionFiles = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `institutions/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  { name: 'studentList', maxCount: 1 },
  { name: 'institutionLogo', maxCount: 1 }
]);

const uploadCarouselImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSS_BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `carousel/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array('images', 3); // Allow up to 3 images

export default upload;
export { uploadInstitutionFiles, uploadCarouselImages };
