// transparencyFilter.js
// フィルターの黒い部分が透明化される
function transparencyFilter(imageData) { // imageDataオブジェクトを直接受け取るように変更
  // 引数オブジェクトから各プロパティを直接取得
  const imageDataA = imageData.imageDataA;
  const imageDataB = imageData.imageDataB;
  const width = imageData.width;
  const height = imageData.height;

  /*
    // 型チェックやサイズチェックが必要な場合は、ここで実装します
    if (
      !(imageDataA instanceof Uint8ClampedArray) ||
      !(imageDataB instanceof Uint8ClampedArray)
    ) {
      throw new TypeError("imageDataA と imageDataB は Uint8ClampedArray である必要があります。");
    }

    if (imageDataA.length !== imageDataB.length) {
      throw new Error("imageDataA と imageDataB は同じサイズである必要があります。");
    }
  */

  // imageDataB のピクセルデータ（色）を imageDataA にコピーし、
  // 元の imageDataA の赤チャンネルの値を透明度として設定する
  for (let i = 0; i < imageDataB.length; i += 4) {
    const redValue = imageDataA[i]; // フィルター画像の赤チャンネルの値を取得

    imageDataA[i]     = imageDataB[i];     // R
    imageDataA[i + 1] = imageDataB[i + 1]; // G
    imageDataA[i + 2] = imageDataB[i + 2]; // B
    imageDataA[i + 3] = redValue;          // アルファチャンネルにフィルターの赤の値を設定
  }

  // 新しいImageDataオブジェクトを生成して返す
  return new ImageData(imageDataA, width, height);
}


// 静的プロパティとしてキーを定義
// こちらの定義は元のままで、改良後の関数の仕様と一致しています
transparencyFilter.keys = {
  input: [
    { name: "imageDataA", type: "Uint8ClampedArray"},
    { name: "imageDataB", type: "Uint8ClampedArray"},
    { name: "width", type: "number", "min": 0},
    { name: "height", type: "number", "min": 0}
  ],
  comment: "imageDataBの各ピクセルを、imageDataAのR値をアルファ値として合成します。",
  output: [
    { name: "data", type: "Uint8ClampedArray"}, // 出力は標準的なImageData形式のためdataに修正
    { name: "width", type: "number", "min": 0},
    { name: "height", type: "number", "min": 0}
  ]
};

export default transparencyFilter;
