let jsonData;
const modules = {};
let inImageData = [];
let uiMap = {};
let layerLength; // 物理レイヤーの枚数

/*⚠️functionIの一つ目のモジュールでは、モジュールの入力変数の名前が変更できない🛑*/

// 関数
function functionI(n) {
  const startTime = performance.now(); // 処理時間を測る
  
  let outImageData = inImageData[0]; // 初期のイメージデータは一枚目
  console.log(outImageData);

  // moduleChose 配列に基づいてモジュールを実行
  for (let i = 0; i < ((jsonData.layerP[n].length-1)/3); i++) { // モジュールの数だけ実行
    let input = {};
    const moduleIndex = i * 3;
    const toModuleNumber = jsonData.layerP[n][moduleIndex + 1].layerNum;
    console.log(i);
    
    // i=0 の場合は jsonData.layerP[n][2] を、i>0 の場合は jsonData.layerP[n][i*3] を参照
    const inputConfig = (i === 0) ? jsonData.layerP[n][2] : jsonData.layerP[n][moduleIndex];
    // i>0 の場合は、直前に実行したモジュールの番号を取得
    const edModuleNumber = (i > 0) ? jsonData.layerP[n][moduleIndex - 2].layerNum : null;

    for (let k = 0; k < inputConfig.length; k++){
      // i=0 のときは 'input', i>0 のときは 'num' というキーの違いを吸収
      const inNum = (i === 0) ? inputConfig[k].input : inputConfig[k].num;
      const inKey = modules[toModuleNumber].keys.input[k].name;
      console.log(`inKey=${inKey}`);
      let data = 0;

      if (typeof inNum === 'number' && inNum >= 0) { // inputが正の数のとき→前の処理結果から受け渡す
        let outKey;
        if (edModuleNumber !== null) {
          // 前のモジュールがある場合、その出力キーを取得
          outKey = modules[edModuleNumber].keys.output[inNum].name;
        } else {
          // 最初のモジュールの場合、inImageDataのプロパティに直接マッピング
          const initialKeys = ['data', 'width', 'height'];
          outKey = initialKeys[inNum];
        }
        
        if (outImageData && outKey in outImageData) {
          data = outImageData[outKey];
        } else {
          console.error(`Key "${outKey}" not found in previous output:`, outImageData);
        }

      } else if (inNum === "img" || inNum === "imgHeight" || inNum === "imgWide") {
        const imgNum = inputConfig[k].for;
        if (inNum === "img") data = inImageData[imgNum].data;
        if (inNum === "imgHeight") data = inImageData[imgNum].height;
        if (inNum === "imgWide") data = inImageData[imgNum].width; // "wide"のタイポを修正
      
      } else { // inputが負の数 or その他文字列のとき→UIから値を取得
        const domId = inputConfig[k].for;
        const element = document.getElementById(domId);
        const type = uiMap[domId];

        if (element) {
            if (["text", "password", "range"].includes(type)) {
              data = element.value;
            } else if (type === "number") {
              data = element.valueAsNumber;
            }
        }
      }
      input[inKey] = data;
    }
    
    console.log(`input=${input}`);
    // 正しいコード
    outImageData = modules[toModuleNumber](input);

    console.log("レイヤー"+toModuleNumber+"を実行")
    console.log(outImageData);
  }

  let imageData;
  // outImageDataがImageDataインスタンスか、適切なプロパティを持つオブジェクトかを確認
  if (outImageData instanceof ImageData) {
    imageData = outImageData;
  } else if (outImageData && outImageData.data instanceof Uint8ClampedArray) {
    // モジュールがプレーンなオブジェクトを返した場合、ImageDataに再構築する
    imageData = new ImageData(outImageData.data, outImageData.width, outImageData.height);
  } else {
    console.error("最終的な出力データが不正です:", outImageData);
    return; // 描画を中止
  }

  const canvas = document.getElementById(`canvas${n+1}`); // IDを指定して描画
  // 描画する画像の大きさに合わせて、キャンバスの大きさを設定し直す
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);


  console.log("functionIが実行されました");
  const endTime = performance.now();
  console.log(`処理時間: ${endTime - startTime} ミリ秒`);
}

function functionA(){
  console.log(`物理レイヤー数${jsonData.layerP.length}`);

  for(let i=0; i<jsonData.layerP.length; i++){
    functionI(i);
  }
  console.log("functionAが実行されました");
}

function functionB() {
  console.log("functionBが実行されました");
}

// 関数マップを定義
const functionMap = {
  "A": functionA,
  "I": functionI,
  "B": functionB
};

// 親要素にDOMを追加する関数＋エレメントの受け取り
async function addElements(data) {
  data.ui.forEach(item => {
      // 新しい要素を作成
      const newElement = document.createElement(item.type);
      newElement.id = item.domId;
      uiMap[item.domId] = item.inputType;

      // input要素の場合、type属性を設定
      if (item.type === 'input' && item.inputType) {
          newElement.type = item.inputType;
      }

      // domNameが存在していたときの設定
      if (item.domName) {
          newElement.name = item.domName;
      }

      // 要素を追加する親要素を取得
      const parentElement = document.getElementById('parent');

      // 新しい要素を親要素に追加 
      if (parentElement) {
          parentElement.appendChild(newElement);
          item[`${item.domId}Element`]= document.getElementById(`${item.domId}`); // エレメントを受け取る
          item[`${item.domId}Element`].style.backgroundColor = '#bbffbb'; //試しでエレメントの背景色を指定
        } else {
          console.error('親要素が見つかりません');
      }
  });
}


// JSONを読み込んでイベントリスナーを設定する関数
async function loadJSON() {
  try {
    const response = await fetch('../YAML6.yaml');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const yamlText = await response.text();
    jsonData = jsyaml.load(yamlText); // ブラウザではグローバル変数 `jsyaml` を使う

    console.log('✅ YAMLファイルの取得と変換に成功しました:');
    console.log(jsonData);

    layerLength = jsonData.layerP.length;
    createCanvasStack();
    
  } catch(e) {
    console.error('❌ エラーが発生しました:', e);
  }
  addElements(jsonData); // jsonDataが読み込まれた後にaddElementsを呼び出す
  // イベントリスナーを設定
  for (let l = 0; l < jsonData.layerP.length; l++){ // 物理レイヤ
    for (let m = 0; m < jsonData.layerP[l][0].length; m++){ //複数のイベントリスナーを１つずつ設定
      let domId = jsonData.layerP[l][0][m].uiId;
      let element = document.getElementById(domId); // DOMエレメントを取得
      let eventType = jsonData.layerP[l][0][m].event;
      let functionName = jsonData.layerP[l][0][m].function; // functionを複数つけることがあるのか、、、それはfunctionの内容にもヨルだろう。
      let functionType = functionMap[functionName]; // マップから関数を取得
      if (typeof functionType === 'function') {
        element.addEventListener(eventType, functionType);
      } else {
        console.error(`${functionName} は関数ではないです`);
      }
    }
  }
  

  // モジュールをインポート
  for (let i = 0; i < jsonData.moduleNames.length; i++) {
    const moduleName = jsonData.moduleNames[i];
    const modulePath = `${jsonData.moduleAdr}${moduleName}.js`; //モジュールの住所を作成

    const module = await import(modulePath);
    modules[i] = module.default; // デフォルトエクスポートを取得
    console.log(`Importing module from: ${modulePath}`);
    let name = modules[i].keys.input[0].name;
    console.log(name);
  }
}

function createCanvasStack(){

  const n = layerLength;

  const container = document.getElementById('canvas-container');
  container.innerHTML = ''; // コンテナをクリア

  for (let i = 1; i <= n; i++) {
      const canvas = document.createElement('canvas');
      canvas.id = `canvas${i}`;
      canvas.width = 800;
      canvas.height = 800;

      // 👇ここからが重ね合わせのスタイル設定
      canvas.style.position = 'absolute'; // 親要素を基準に配置

      // 完全に重ねる場合は left と top を 0 にする
      canvas.style.left = '0px';
      canvas.style.top = '60px';
      
      // canvas.style.left = `${i * 5}px`; // 少しずらす場合
      // canvas.style.top = `${i * 5}px`;  // 少しずらす場合


      // 重なり順を設定 (iが大きいほど手前に来る)
      canvas.style.zIndex = i;
      // 👆ここまで

      // 視覚的に分かりやすくするために枠線と色をつける（任意）
      const ctx = canvas.getContext('2d');
      const hue = (i * 60) % 360;
      ctx.fillStyle = `hsla(${hue}, 70%, 80%, 0.1)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
      ctx.lineWidth = 5;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Canvas ${i} (z-index: ${i})`, canvas.width / 2, canvas.height / 2);


      container.appendChild(canvas);
  }
}



// JSONデータを読み込む関数を呼び出す
loadJSON();



// ファイルを読むモジュールをインポート
import { getImageData } from "./module.js";

// HTML要素とのリンク付け
const fileInput = document.getElementById('fileInput');
// const ctx = canvas.getContext('2d');




// n番目のファイルを処理（例: 0番目なら最初のファイル）
let n = 0;

// ファイル選択されたら、、、モジュールを順番に実行
fileInput.addEventListener('change', async function(e) {
  const files = e.target.files;

  console.log("ファイル数:", files.length);
  console.log("取得されたファイル:", files[0]);
  console.log("全てのファイル:", files);
  
  const file = files[0];  // n番目のファイル
  const result = await getImageData(file);  // 非同期で画像データ取得
  inImageData[n] = result.imageData;  // 配列のn番目に格納
  
  n=n+1;
});



// 入力を要するモジュールを作成
// なんとかしてモジュールにDOM部品の値を代入
// あと、イベントハンドラで動作する画像リセットが必要

// イベントリスナーの設定とモジュールの実行はそれぞれfunctionTypeの一つとして関数化して、ユーザーのタイミングでも実行できるようにする
// あと、functionTypeの一つとして変数を受け取るプログラムも関数として設定しておく

// 2024.12.19 FunctionA or B に入力値を入れられるようにしてくれ！！！

// layerP（レイヤーのまとまり）の数だけ実行したい。つまり、複数のレイヤーのまとまりを実行できるってこと
// 2025.1.27 成功！

// 2025.5.27 複数の写真読み込み成功。
// ファイルを選択した後▶モジュールで画像をUnit8Arrayに変換▶グローバル変数に代入▶
