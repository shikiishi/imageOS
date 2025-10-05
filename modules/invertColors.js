function invertColors(imageData) {
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = 255 - imageData.data[i]; // red
    imageData.data[i + 1] = 255 - imageData.data[i + 1]; // green
    imageData.data[i + 2] = 255 - imageData.data[i + 2]; // blue
  }
  return imageData;
}

// 静的プロパティとしてキーを定義
invertColors.keys = {
  input: [
    { name: "data", type: "Uint8ClampedArray"},
    { name: "width", type: "number", "min": 0},
    { name: "height", type: "number", "min": 0}
  ],
  comment: "User data fetching function",
  output: [
    { name: "data", type: "Uint8ClampedArray"},
    { name: "width", type: "number", "min": 0},
    { name: "height", type: "number", "min": 0}
  ]  
};

export default invertColors;
