function toGrayscale(imageData) { //⚠️まだこのプログラムは作ってない。コピーしただけ。画像をそのまま下のレイヤーに渡すモジュールです
  for (let i = 0; i < imageData.data.length; i += 4) {
    const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    imageData.data[i] = avg; // red
    imageData.data[i + 1] = avg; // green
    imageData.data[i + 2] = avg; // blue
  }
  return imageData;
}

// 静的プロパティとしてキーを定義
toGrayscale.keys = {
  input: [
    { name: "data", type: "Uint8ClampedArray"},
    { name: "width", type: "number", "min": 0},
    { name: "height", type: "number", "min": 0}
  ],
  comment: "",
  output: [
    { name: "data", type: "Uint8ClampedArray"},
    { name: "width", type: "number", "min": 0},
    { name: "height", type: "number", "min": 0}
  ]  
};

export default toGrayscale;
