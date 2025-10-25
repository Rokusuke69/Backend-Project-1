var ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});


function uploadFile(file){
    return new Promise((resolve, reject) => {
        imagekit.upload({
            file: file.buffer,
            fileName: file.originalname, // I changed this back to the original name, which is usually more helpful
            
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