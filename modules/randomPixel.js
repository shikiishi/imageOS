/**
 * 画像内の8x8ピクセル範囲の中心ピクセルに、範囲内のランダムなピクセルの値を代入するモジュール。
 *
 * @param {object} input - 入力データオブジェクト。
 * @param {Uint8ClampedArray} input.data - 画像のピクセルデータ。
 * @param {number} input.width - 画像の幅。
 * @param {number} input.height - 画像の高さ。
 * @returns {ImageData} - 処理後のImageDataオブジェクト。
 */
function randomPixelAreaToCenter(input) {
    const { data, width, height } = input;
  
    // 出力用のImageDataオブジェクトを作成
    const newData = new Uint8ClampedArray(data);
    const outputData = new ImageData(newData, width, height);
  
    // 8x8ピクセル範囲の中心を移動させながら処理を行う
    for (let y = 3; y < height - 4; y++) {
      for (let x = 3; x < width - 4; x++) {
        // 8x8ピクセル範囲内でランダムな位置を選択
        const randomX = Math.floor(Math.random() * 8);
        const randomY = Math.floor(Math.random() * 8);
  
        // ランダムに選択されたピクセルの、画像全体での位置を計算
        const sourceX = x - 3 + randomX;
        const sourceY = y - 3 + randomY;
  
        // 中心ピクセルの位置
        const centerX = x;
        const centerY = y;
  
        // 各ピクセルのインデックスを計算
        const sourceIndex = (sourceY * width + sourceX) * 4;
        const centerIndex = (centerY * width + centerX) * 4;
  
        // ランダムに選択したピクセルの色情報 (RGBA) を中心のピクセルに代入
        newData[centerIndex] = data[sourceIndex];       // Red
        newData[centerIndex + 1] = data[sourceIndex + 1]; // Green
        newData[centerIndex + 2] = data[sourceIndex + 2]; // Blue
        newData[centerIndex + 3] = data[sourceIndex + 3]; // Alpha
      }
    }
  
    return outputData;
  }
  
  // モジュールのメタデータを定義 (アプリのフレームワーク用)
  randomPixelAreaToCenter.keys = {
    input: [
      { name: "data", type: "Uint8ClampedArray" },
      { name: "width", type: "number", min: 8 },
      { name: "height", type: "number", min: 8 }
    ],
    comment: "画像内の8x8ピクセル範囲の中心ピクセルに、範囲内のランダムなピクセルの値を代入します。この処理を画像全体をスキャンするように繰り返します。",
    output: [
      { name: "data", type: "Uint8ClampedArray" },
      { name: "width", type: "number", min: 0 },
      { name: "height", type: "number", min: 0 }
    ]
  };
  
  export default randomPixelAreaToCenter;
  
