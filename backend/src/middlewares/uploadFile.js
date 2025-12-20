import multer from 'multer';

 const upload = multer({ dest: 'uploads/' });

export const uploadFile = upload.single('file');