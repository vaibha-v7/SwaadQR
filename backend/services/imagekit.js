const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/vaibhav7"
});

async function uploadImageToImageKit(fileBuffer, fileName, folder = "swaadqr/dishes") {
  const uploadHandler = typeof imagekit.upload === "function"
    ? imagekit.upload.bind(imagekit)
    : imagekit.files.upload.bind(imagekit.files);

  const uploadResponse = await uploadHandler({
    file: fileBuffer.toString("base64"),
    fileName,
    folder,
    useUniqueFileName: true
  });

  return uploadResponse.url;
}

module.exports = {
  uploadImageToImageKit
};