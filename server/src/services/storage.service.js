const { ImageKit } = require("@imagekit/nodejs");

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadPhoto(buffer) {
  const response = await client.files.upload({
    file: buffer.toString("base64"),
    fileName: "photo" + Date.now(),
    folder: "SimpleInsta/photo",
  });
  
  return response;
}

module.exports = { uploadPhoto };