export async function getImageData(file) {
    return new Promise((resolve, reject) => {
       const img = new Image();
       const reader = new FileReader();
  
       reader.onload = function(e) {
       img.onload = function() {
       const canvas = document.createElement('canvas');
       canvas.width = img.width;
       canvas.height = img.height;
       const ctx = canvas.getContext('2d');
       ctx.drawImage(img, 0, 0);
       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
       const imageColor = []; // ここから下のimageColorは使われてない
       for (let i = 0; i < imageData.data.length; i += 4) {
        imageColor.push(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]);
        }
       resolve({ imageData, imageColor });
      };
   img.src = e.target.result;
  };
  
  reader.readAsDataURL(file);
  });
}
