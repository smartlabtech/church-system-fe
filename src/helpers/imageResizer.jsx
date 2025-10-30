import Resizer from "react-image-file-resizer"

const resizeFile = (file) => {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      250,
      250,
      "JPEG",
      100,
      0,
      (resizedFile) => {
        resolve({
          base64: null, // You can skip base64 if not needed
          file: resizedFile
        })
      },
      "file", // Output type as a file
      100,
      100
    )
  })
}

export default resizeFile
