import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/receipts');
    },
    filename:(req,file,cb)=>{
        const unique=Date.now()+'-'+file.originalname;
        cb(null,unique);
    }
});

export const upload=multer({
    storage,
    fileFilter:(req,file,cb)=>{
        const ext=path.extname(file.originalname).toLowerCase();
        if(!['.jpg','.jpeg','.png','.pdf'].includes(ext)){
            return cb(new Error('Only image and pdf is allowed'));
        }
        cb(null,true);
    }
});