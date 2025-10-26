var ImageKit = require("imagekit");
var mongoose = require('mongoose');
var path = require('path'); 

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

function uploadFile(file){
    return new Promise((resolve, reject) => {
        
        const fileExtension = path.extname(file.originalname); 

        imagekit.upload({
            file: file.buffer,
            fileName: new mongoose.Types.ObjectId().toString() + fileExtension, 
            folder: "Moody-Player-Audio",
            
            // --- THIS IS THE FIX ---
            timeout: 60000 // 60,000ms = 60 seconds
            
        },(error,result)=>{
            if(error){
                reject(error);
            }else{
               resolve(result);
            }
        })
    });
}

module.exports = uploadFile;