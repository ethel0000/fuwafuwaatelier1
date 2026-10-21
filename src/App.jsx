import React, { useState, useEffect, useRef } from 'react';
import { 
  Scissors, Sparkles, RefreshCw, Copy, Check, Lock, Unlock, 
  Settings, Plus, Trash2, Image as ImageIcon, ZoomIn, ChevronRight, AlertCircle, Save
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// --- Firebase 設定 ---
const firebaseConfig = {
  apiKey: "AIzaSyCuJcWKFDnsqHvRA3trE8jaOMP0LDLBKHA",
  authDomain: "fuwafuwaatelier-3921c.firebaseapp.com",
  projectId: "fuwafuwaatelier-3921c",
  storageBucket: "fuwafuwaatelier-3921c.firebasestorage.app",
  messagingSenderId: "720142986041",
  appId: "1:720142986041:web:283ea77dbb3ea0c87956e8",
  measurementId: "G-E7BXXKV1VB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 預設資料
const INITIAL_DATA = {
  queueCount: 3,
  materials: [
    {
      id: 'milk',
      name: 'ミルクコットンヤーン',
      desc: '肌触りが良く滑らかなコットンブレンド糸・日常使いに最適です。',
      craftType: 'both',
      extraPrice: 0,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80',
      colors: [
        { id: 'm1', name: 'オフホワイト', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80' },
        { id: 'm2', name: 'ベビーピンク', image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&auto=format&fit=crop&q=80' },
        { id: 'm3', name: 'アイスブルー', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop&q=80' }
      ]
    },
    {
      id: 'puni',
      name: 'ぷにヤーン',
      desc: 'ぷにぷに、もちもちとした独特の感触が可愛い特殊モールヤーン。',
      craftType: 'both',
      extraPrice: 0,
      image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&auto=format&fit=crop&q=80',
      colors: [
        { id: 'p1', name: 'エクリュ', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80' },
        { id: 'p2', name: 'ラベンダー', image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&auto=format&fit=crop&q=80' }
      ]
    },
    {
      id: 'mohair',
      name: 'モヘアヤーン',
      desc: 'ふんわりとした毛足が特徴の上質なモヘア。温かみのある仕上がりに。',
      craftType: 'needle',
      extraPrice: 0,
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop&q=80',
      colors: [
        { id: 'mo1', name: 'スノーホワイト', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80' },
        { id: 'mo2', name: 'ミントグリーン', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop&q=80' }
      ]
    },
    {
      id: 'nep',
      name: 'ネップヤーン',
      desc: '色とりどりの小さな粒が編み込まれた可愛いアクセント糸。',
      craftType: 'needle',
      extraPrice: 300,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80',
      colors: [
        { id: 'n1', name: 'オートミールネップ', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80' },
        { id: 'n2', name: 'グレーネップ', image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&auto=format&fit=crop&q=80' }
      ]
    }
  ],
  patterns: [
    {
      id: 'pat_rib',
      name: 'リブ編み',
      allowedCraft: 'both',
      allowedMaterials: ['milk', 'puni', 'mohair', 'nep'],
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'pat_waffle',
      name: 'ワッフル編み',
      allowedCraft: 'crochet',
      allowedMaterials: ['milk', 'puni'],
      image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'pat_paw',
      name: '肉球パターン',
      allowedCraft: 'crochet',
      allowedMaterials: ['milk', 'puni'],
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'pat_english',
      name: 'イギリス編み',
      allowedCraft: 'needle',
      allowedMaterials: ['milk', 'puni', 'mohair', 'nep'],
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'pat_heart',
      name: 'ハートパターン',
      allowedCraft: 'needle',
      allowedMaterials: ['puni'],
      image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&auto=format&fit=crop&q=80'
    }
  ]
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [dbData, setDbData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = doc(db, "atelier", "config");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDbData(docSnap.data());
        } else {
          await setDoc(docRef, INITIAL_DATA);
        }
      } catch (err) {
        console.error("載入資料失敗:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const saveToCloud = async (newData) => {
    try {
      await setDoc(doc(db, "atelier", "config"), newData);
      setDbData(newData);
    } catch (err) {
      console.error("儲存失敗:", err);
      alert("儲存失敗，請檢查網路連線");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-[#7C6F64]">
        <div className="flex items-center space-x-2 animate-pulse">
          <Sparkles className="w-6 h-6 text-[#9CAFAA]" />
          <span className="text-lg">ふわふわアトリエを読み込み中...</span>
        </div>
      </div>
    );
  }

  return currentPath === '/admin' ? (
    <AdminView dbData={dbData} saveToCloud={saveToCloud} />
  ) : (
    <CustomerView dbData={dbData} />
  );
}

// ==========================
// 客人版畫面
// ==========================
function CustomerView({ dbData }) {
  const [craftType, setCraftType] = useState('needle');
  const [selectedMaterialId, setSelectedMaterialId] = useState(dbData.materials[0]?.id || 'milk');
  const [selectedColors, setSelectedColors] = useState([dbData.materials[0]?.colors[0]?.id || 'm1']);
  const [selectedPatternId, setSelectedPatternId] = useState(dbData.patterns[0]?.id || 'pat_rib');
  const [fringe, setFringe] = useState('なし');
  const [customMemo, setCustomMemo] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const currentMat = dbData.materials.find(m => m.id === selectedMaterialId);
    if (currentMat) {
      if (craftType === 'crochet' && currentMat.craftType === 'needle') {
        const fallbackMat = dbData.materials.find(m => m.craftType !== 'needle');
        if (fallbackMat) {
          setSelectedMaterialId(fallbackMat.id);
        }
      }
    }
  }, [craftType, selectedMaterialId, dbData.materials]);

  useEffect(() => {
    const currentMat = dbData.materials.find(m => m.id === selectedMaterialId);
    if (currentMat && currentMat.colors.length > 0) {
      setSelectedColors([currentMat.colors[0].id]);
    } else {
      setSelectedColors([]);
    }
  }, [selectedMaterialId, dbData.materials]);

  useEffect(() => {
    const currentPat = dbData.patterns.find(p => p.id === selectedPatternId);
    if (currentPat) {
      const craftValid = currentPat.allowedCraft === 'both' || currentPat.allowedCraft === craftType;
      const matValid = currentPat.allowedMaterials.includes(selectedMaterialId);
      if (!craftValid || !matValid) {
        const fallbackPat = dbData.patterns.find(p => 
          (p.allowedCraft === 'both' || p.allowedCraft === craftType) &&
          p.allowedMaterials.includes(selectedMaterialId)
        );
        if (fallbackPat) {
          setSelectedPatternId(fallbackPat.id);
        }
      }
    }
  }, [craftType, selectedMaterialId, selectedPatternId, dbData.patterns]);

  const basePrice = craftType === 'needle' ? 4500 : 4000;
  const currentMat = dbData.materials.find(m => m.id === selectedMaterialId);
  const materialExtraPrice = currentMat ? (currentMat.extraPrice || 0) : 0;
  const extraColorCount = Math.max(0, selectedColors.length - 1);
  const colorExtraPrice = extraColorCount * 200;
  const fringePrice = fringe === 'あり' ? 200 : 0;
  const shippingFee = 600;

  const totalPrice = basePrice + materialExtraPrice + colorExtraPrice + fringePrice + shippingFee;

  const queue = Number(dbData.queueCount) || 0;
  const minWeeks = queue * 3;
  const maxWeeks = queue * 4;
  const waitTimeString = queue === 0 ? '約 1〜2 週間' : `約 ${minWeeks}〜${maxWeeks} 週間`;

  const handleColorToggle = (colorId) => {
    if (selectedColors.includes(colorId)) {
      if (selectedColors.length === 1) return;
      setSelectedColors(selectedColors.filter(id => id !== colorId));
    } else {
      setSelectedColors([...selectedColors, colorId]);
    }
  };

  const copyOrderText = () => {
    const matObj = dbData.materials.find(m => m.id === selectedMaterialId);
    const patObj = dbData.patterns.find(p => p.id === selectedPatternId);
    const selectedColorNames = selectedColors.map(cId => {
      const col = matObj?.colors.find(c => c.id === cId);
      return col ? col.name : '';
    }).filter(Boolean).join('、');

    const text = `【オーダー内容】
・編み方：${craftType === 'needle' ? '棒針編み (4,500円)' : 'かぎ針編み (4,000円)'}
・毛糸の素材：${matObj?.name || ''}${matObj?.extraPrice ? ` (+\${matObj.extraPrice}円)` : ''}
・編み地パターン：${patObj?.name || ''}
・カラー：${selectedColorNames} ${extraColorCount > 0 ? `(追加${extraColorCount}色 +${colorExtraPrice}円)` : ''}
・フリンジ：${fringe} ${fringe === 'あり' ? '(+200円)' : ''}
${customMemo ? `・ご要望・備考：\${customMemo}\n` : ''}
-----------------
お支払い合計：${totalPrice.toLocaleString()}円（送料600円込み）
よろしくお願いいたします！`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#5C5346] font-sans pb-24">
      <header className="bg-white/90 backdrop-blur border-b border-[#EFECE6] sticky top-0 z-30 px-4 py-3 flex justify-between items-center max-w-2xl mx-auto shadow-sm">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#C4A47C]" />
          <div>
            <h1 className="text-base font-bold tracking-wider text-[#4A4033]">ふわふわアトリエ</h1>
            <p className="text-[10px] text-[#8C7C6C]">手作りマフラー.オーダーメイド</p>
          </div>
        </div>
        <a 
          href="/admin" 
          onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/admin'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="text-xs bg-[#F4EFEB] hover:bg-[#EAE4DC] px-3.5 py-1.5 rounded-full text-[#7C6F64] transition flex items-center space-x-1"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>管理者画面</span>
        </a>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        <div className="bg-[#FAF7F2] border border-[#EBE4DC] rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-full bg-[#EFE8DF] flex items-center justify-center text-[#9C8C7C] shadow-inner">
              <ClockIcon className="w-5 h-5 text-[#A67B5B]" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-0.5">
                <span className="text-[10px] bg-[#E8E2D8] text-[#7C6F64] px-2 py-0.5 rounded-full font-medium">完全受注生産</span>
                <span className="text-[10px] text-[#8C7C6C]">（1点ずつ一人で製作中）</span>
              </div>
              <p className="text-xs text-[#8C7C6C]">現在の製作待ち状況</p>
              <p className="text-sm font-medium text-[#4A4033]">ただいま前に <span className="font-bold text-[#A67B5B]">{queue} 件</span> のオーダーが入っています。</p>
            </div>
          </div>
          <div className="text-right pl-3 border-l border-[#EBE4DC]">
            <p className="text-[10px] text-[#8C7C6C]">ただいまの納期目安</p>
            <p className="text-base font-bold text-[#A67B5B] mt-0.5">{waitTimeString}</p>
            <p className="text-[9px] text-[#A89F91]">※ご注文確定より順次製作</p>
          </div>
        </div>

        <p className="text-xs text-center text-[#8C7C6C] px-2">
          ✿ すべて心を込めた手作業のため、お時間をいただいております。時間に余裕を持ってご注文ください ✿
        </p>

        {/* 1. 編み方 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFECE6]">
          <h2 className="text-sm font-bold text-[#4A4033] mb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-[#F5EFEB] text-[#A67B5B] flex items-center justify-center text-xs font-bold">1</span>
            <span>編み方を選択</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'needle', type: '棒針編み', price: '4,500円', desc: '柔らかく伸びが良い定番の編み方・モヘアやネップなどの専用素材が選べます。' },
              { id: 'crochet', type: 'かぎ針編み', price: '4,000円', desc: 'しっかりとうねりがあり崩れにくい編み地・肉球模様やワッフル模様に対応。' }
            ].map(item => {
              const isSelected = craftType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCraftType(item.id)}
                  className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    isSelected 
                      ? 'border-[#C4A47C] bg-[#FAF7F2] ring-1 ring-[#C4A47C]' 
                      : 'border-[#EFECE6] hover:border-[#DCD6CC]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-[#4A4033]">{item.type}</span>
                      <span className="font-bold text-sm text-[#A67B5B]">{item.price}</span>
                    </div>
                    <p className="text-xs text-[#8C7C6C] leading-relaxed mb-3">{item.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="text-[11px] text-[#A67B5B] font-medium flex items-center space-x-1 mt-auto">
                      <Check className="w-3.5 h-3.5" />
                      <span>選択中</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. 毛糸の素材 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFECE6]">
          <h2 className="text-sm font-bold text-[#4A4033] mb-1 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-[#F5EFEB] text-[#A67B5B] flex items-center justify-center text-xs font-bold">2</span>
            <span>毛糸の素材を選択</span>
          </h2>
          <p className="text-xs text-[#9C8C7C] mb-4 ml-8">1つの素材をお選びください（※選んだ素材に応じたカラーが表示されます）</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dbData.materials.map((mat) => {
              const isDisabled = craftType === 'crochet' && mat.craftType === 'needle';
              const isSelected = selectedMaterialId === mat.id;

              return (
                <div
                  key={mat.id}
                  onClick={() => !isDisabled && setSelectedMaterialId(mat.id)}
                  className={`p-3.5 rounded-xl border transition flex space-x-3 relative ${
                    isDisabled 
                      ? 'bg-gray-100/70 border-gray-200 opacity-50 cursor-not-allowed' 
                      : isSelected 
                        ? 'border-[#C4A47C] bg-[#FAF7F2] ring-1 ring-[#C4A47C] cursor-pointer' 
                        : 'border-[#EFECE6] hover:border-[#DCD6CC] cursor-pointer'
                  }`}
                >
                  <img src={mat.image} alt={mat.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className={`font-bold text-xs ${isDisabled ? 'text-gray-400' : 'text-[#4A4033]'}`}>{mat.name}</span>
                        {mat.extraPrice > 0 && (
                          <span className="text-xs font-bold text-[#A67B5B]">+{mat.extraPrice}円</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8C7C6C] mt-1 line-clamp-2">{mat.desc}</p>
                    </div>

                    {isDisabled && (
                      <span className="text-[10px] font-bold text-red-400 mt-1">※棒針編み限定</span>
                    )}

                    {isSelected && !isDisabled && (
                      <div className="text-[11px] text-[#A67B5B] font-medium flex items-center space-x-1 mt-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>選択中</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. 編み地パターン */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFECE6]">
          <h2 className="text-sm font-bold text-[#4A4033] mb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-[#F5EFEB] text-[#A67B5B] flex items-center justify-center text-xs font-bold">3</span>
            <span>編み地パターンを選択</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dbData.patterns.map((pat) => {
              const craftValid = pat.allowedCraft === 'both' || pat.allowedCraft === craftType;
              const matValid = pat.allowedMaterials.includes(selectedMaterialId);
              const isDisabled = !craftValid || !matValid;
              const isSelected = selectedPatternId === pat.id;

              let disabledReason = '';
              if (!craftValid) {
                disabledReason = pat.allowedCraft === 'needle' ? '※棒針限定' : '※かぎ針限定';
              } else if (!matValid) {
                disabledReason = '※現在の毛糸非対応';
              }

              return (
                <div
                  key={pat.id}
                  onClick={() => !isDisabled && setSelectedPatternId(pat.id)}
                  className={`p-3 rounded-xl border transition flex items-center space-x-3 ${
                    isDisabled 
                      ? 'bg-gray-100/70 border-gray-200 opacity-50 cursor-not-allowed' 
                      : isSelected 
                        ? 'border-[#C4A47C] bg-[#FAF7F2] ring-1 ring-[#C4A47C] cursor-pointer' 
                        : 'border-[#EFECE6] hover:border-[#DCD6CC] cursor-pointer'
                  }`}
                >
                  <img src={pat.image} alt={pat.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <span className={`font-bold text-xs ${isDisabled ? 'text-gray-400' : 'text-[#4A4033]'}`}>{pat.name}</span>
                    {isDisabled ? (
                      <p className="text-[10px] font-bold text-red-400 mt-1">{disabledReason}</p>
                    ) : isSelected ? (
                      <div className="text-[11px] text-[#A67B5B] font-medium flex items-center space-x-1 mt-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>選択中</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. カラー選択 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFECE6]">
          <h2 className="text-sm font-bold text-[#4A4033] mb-1 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-[#F5EFEB] text-[#A67B5B] flex items-center justify-center text-xs font-bold">4</span>
            <span>カラーを選択（複数選択可）</span>
          </h2>
          <p className="text-xs text-[#9C8C7C] mb-4 ml-8">2色目以降 1色につき +200円</p>

          {currentMat && currentMat.colors.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentMat.colors.map((col) => {
                const isSelected = selectedColors.includes(col.id);
                return (
                  <div
                    key={col.id}
                    onClick={() => handleColorToggle(col.id)}
                    className={`cursor-pointer rounded-xl p-2.5 border transition flex items-center space-x-2.5 ${
                      isSelected 
                        ? 'border-[#C4A47C] bg-[#FAF7F2] ring-1 ring-[#C4A47C] shadow-sm' 
                        : 'border-[#EFECE6] bg-white hover:border-[#DCD6CC]'
                    }`}
                  >
                    <img src={col.image} alt={col.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#5C5346] truncate">{col.name}</p>
                      {isSelected && (
                        <span className="text-[10px] text-[#A67B5B] font-bold">選択中</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">カラーが登録されていません。</p>
          )}
        </section>

        {/* 5. フリンジ */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFECE6]">
          <h2 className="text-sm font-bold text-[#4A4033] mb-3 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-[#F5EFEB] text-[#A67B5B] flex items-center justify-center text-xs font-bold">5</span>
            <span>フリンジ（両端の飾り）</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { opt: 'あり', price: '+200円' },
              { opt: 'なし', price: '0円' }
            ].map(item => (
              <button
                key={item.opt}
                onClick={() => setFringe(item.opt)}
                className={`p-3.5 rounded-xl border text-center transition ${
                  fringe === item.opt 
                    ? 'border-[#C4A47C] bg-[#FAF7F2] ring-1 ring-[#C4A47C]' 
                    : 'border-[#EFECE6] hover:border-[#DCD6CC]'
                }`}
              >
                <div className="font-bold text-xs text-[#4A4033]">{item.opt}</div>
                <div className="text-[10px] text-[#A67B5B] mt-0.5">{item.price}</div>
              </button>
            ))}
          </div>
        </section>

        {/* 6. ご要望・備考 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFECE6]">
          <h2 className="text-sm font-bold text-[#4A4033] mb-2 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-[#F5EFEB] text-[#A67B5B] flex items-center justify-center text-xs font-bold">6</span>
            <span>ご要望・備考（任意）</span>
          </h2>
          <textarea
            value={customMemo}
            onChange={(e) => setCustomMemo(e.target.value)}
            placeholder="※2色以上選択された場合の色配置（例：メインをオフホワイト、両端をベビーピンクにするなど）や、長めのサイズ希望などをご記入ください。"
            className="w-full p-3 rounded-xl border border-[#DCD6CC] text-xs focus:outline-none focus:ring-1 focus:ring-[#C4A47C] h-24 resize-none"
          />
        </section>

        {/* 注意点 Notice Header */}
        <section className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EBE4DC] space-y-2">
          <h3 className="text-xs font-bold text-[#4A4033] flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-[#A67B5B]" />
            <span>注意点</span>
          </h3>
          <ul className="text-[11px] text-[#7C6F64] space-y-1 pl-5 list-disc leading-relaxed">
            <li>すべて手作業で一点ずつ制作しているため、完璧を求める方はご遠慮ください。</li>
            <li><strong>お支払いはPayPayのみとなっております。</strong></li>
            <li>ご注文確定後のキャンセル・変更は原則お受けできません。</li>
          </ul>
        </section>

        {/* 底部總結與複製按鈕 */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#EFECE6] sticky bottom-4 z-20">
          <div className="flex justify-between items-baseline mb-3 pb-3 border-b border-[#EFECE6]">
            <div>
              <span className="text-xs text-[#8C7C6C]">送料600円込み</span>
              <p className="text-sm font-bold text-[#4A4033]">お支払い合計</p>
            </div>
            <div className="text-xl font-bold text-[#A67B5B]">
              {totalPrice.toLocaleString()}円
            </div>
          </div>

          <button
            onClick={copyOrderText}
            className="w-full bg-[#A67B5B] hover:bg-[#956D4F] text-white py-3.5 rounded-xl font-bold text-sm shadow transition flex items-center justify-center space-x-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>注文内容をコピーしました！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>注文内容をコピーする</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-[#9C8C7C] mt-2">
            ※オーダーの文章をコピーして、そのまま X (Twitter) <a href="https://x.com/haachansub" target="_blank" rel="noreferrer" className="text-[#A67B5B] font-bold underline">@haachansub</a> のDMに貼り付けてご送信ください。
          </p>
        </div>
      </main>
    </div>
  );
}

function ClockIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  );
}

// ==========================
// 管理者版畫面
// ==========================
function AdminView({ dbData, saveToCloud }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [queue, setQueue] = useState(dbData.queueCount);
  const [materials, setMaterials] = useState(dbData.materials);
  const [patterns, setPatterns] = useState(dbData.patterns);
  const [saving, setSaving] = useState(false);

  const [cropModal, setCropModal] = useState({ open: false, type: null, matId: null, colorId: null, patId: null, imgUrl: '' });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'Ethel20030810') {
      setIsAuthed(true);
    } else {
      alert('パスワードが間違っています');
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    await saveToCloud({
      queueCount: Number(queue),
      materials: materials,
      patterns: patterns
    });
    setSaving(false);
    alert('変更を保存し、クラウドに同期しました！');
  };

  const updateMaterialName = (matId, newName) => {
    setMaterials(materials.map(m => m.id === matId ? { ...m, name: newName } : m));
  };
  const deleteMaterial = (matId) => {
    if (confirm('この素材を削除してもよろしいですか？')) {
      setMaterials(materials.filter(m => m.id !== matId));
    }
  };

  const updateColorName = (matId, colorId, newName) => {
    setMaterials(materials.map(mat => {
      if (mat.id !== matId) return mat;
      return {
        ...mat,
        colors: mat.colors.map(col => col.id === colorId ? { ...col, name: newName } : col)
      };
    }));
  };
  const deleteColor = (matId, colorId) => {
    setMaterials(materials.map(mat => {
      if (mat.id !== matId) return mat;
      return {
        ...mat,
        colors: mat.colors.filter(col => col.id !== colorId)
      };
    }));
  };
  const addColorToMaterial = (matId) => {
    const newColorId = 'c_' + Date.now();
    setMaterials(materials.map(mat => {
      if (mat.id !== matId) return mat;
      return {
        ...mat,
        colors: [...mat.colors, { id: newColorId, name: '新規カラー', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80' }]
      };
    }));
  };

  const updatePatternName = (patId, newName) => {
    setPatterns(patterns.map(p => p.id === patId ? { ...p, name: newName } : p));
  };
  const deletePattern = (patId) => {
    if (confirm('この編み柄を削除してもよろしいですか？')) {
      setPatterns(patterns.filter(p => p.id !== patId));
    }
  };

  const handleFileUpload = (type, matId, colorId, patId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCropModal({ open: true, type, matId, colorId, patId, imgUrl: event.target.result });
      setScale(1);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = cropModal.imgUrl;
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, 300);
      ctx.save();
      ctx.translate(150 + position.x, 150 + position.y);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.85);

      if (cropModal.type === 'material') {
        setMaterials(materials.map(m => m.id === cropModal.matId ? { ...m, image: croppedBase64 } : m));
      } else if (cropModal.type === 'color') {
        setMaterials(materials.map(mat => {
          if (mat.id !== cropModal.matId) return mat;
          return {
            ...mat,
            colors: mat.colors.map(col => col.id === cropModal.colorId ? { ...col, image: croppedBase64 } : col)
          };
        }));
      } else if (cropModal.type === 'pattern') {
        setPatterns(patterns.map(p => p.id === cropModal.patId ? { ...p, image: croppedBase64 } : p));
      }

      setCropModal({ open: false, type: null, matId: null, colorId: null, patId: null, imgUrl: '' });
    };
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-sm border border-[#EFECE6] w-full max-w-sm space-y-4">
          <div className="text-center space-y-1">
            <Lock className="w-8 h-8 text-[#A67B5B] mx-auto" />
            <h1 className="text-base font-bold text-[#4A4033]">管理者ログイン</h1>
            <p className="text-xs text-[#8C7C6C]">パスワードを入力してください</p>
          </div>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="パスワード"
            className="w-full px-4 py-2.5 rounded-xl border border-[#DCD6CC] text-sm focus:outline-none focus:ring-1 focus:ring-[#C4A47C]"
          />
          <button type="submit" className="w-full bg-[#A67B5B] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#956D4F] transition">
            ログイン
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#5C5346] font-sans pb-20">
      <header className="bg-white border-b border-[#EFECE6] sticky top-0 z-30 px-4 py-3 flex justify-between items-center max-w-2xl mx-auto">
        <h1 className="text-sm font-bold text-[#4A4033] flex items-center space-x-1.5">
          <Settings className="w-4 h-4 text-[#A67B5B]" />
          <span>管理者設定（クラウド同期）</span>
        </h1>
        <div className="flex items-center space-x-2">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
            className="text-xs bg-[#F4EFEB] px-3 py-1.5 rounded-full text-[#7C6F64] hover:bg-[#EAE4DC] transition"
          >
            お客様画面へ
          </a>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-[#A67B5B] hover:bg-[#956D4F] text-white px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? '保存中...' : '変更を保存'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFECE6]">
          <h2 className="text-sm font-bold text-[#4A4033] mb-3">待ち人数（queueCount）の調整</h2>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="0"
              value={queue}
              onChange={(e) => setQueue(e.target.value)}
              className="w-24 px-3 py-2 border border-[#DCD6CC] rounded-xl text-center font-bold text-lg"
            />
            <span className="text-xs text-[#8C7C6C]">人（納期表示：約 {queue * 3}〜{queue * 4} 週間）</span>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFECE6] space-y-6">
          <h2 className="text-sm font-bold text-[#4A4033]">毛糸素材とカラー管理</h2>

          {materials.map((mat) => (
            <div key={mat.id} className="border border-[#EFECE6] rounded-xl p-4 bg-[#FAF7F2]/40 space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-[#EFECE6]">
                <div className="relative group cursor-pointer w-12 h-12 flex-shrink-0">
                  <img src={mat.image} alt={mat.name} className="w-12 h-12 rounded-lg object-cover border" />
                  <label className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white">
                    <ImageIcon className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload('material', mat.id, null, null, e)} className="hidden" />
                  </label>
                </div>
                <input
                  type="text"
                  value={mat.name}
                  onChange={(e) => updateMaterialName(mat.id, e.target.value)}
                  className="flex-1 font-bold text-sm px-3 py-1.5 border border-[#DCD6CC] rounded-lg"
                />
                <button onClick={() => deleteMaterial(mat.id)} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 pl-2">
                <p className="text-xs font-bold text-[#7C6F64]">カラー一覧：</p>
                {mat.colors.map((col) => (
                  <div key={col.id} className="flex items-center space-x-3 bg-white p-2 rounded-xl border border-[#EFECE6]">
                    <div className="relative group cursor-pointer w-10 h-10 flex-shrink-0">
                      <img src={col.image} alt={col.name} className="w-10 h-10 rounded-md object-cover border" />
                      <label className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload('color', mat.id, col.id, null, e)} className="hidden" />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) => updateColorName(mat.id, col.id, e.target.value)}
                      className="flex-1 px-3 py-1 border border-[#DCD6CC] rounded-lg text-xs"
                    />
                    <button onClick={() => deleteColor(mat.id, col.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addColorToMaterial(mat.id)}
                  className="w-full py-1.5 border border-dashed border-[#C4A47C] rounded-lg text-xs font-bold text-[#A67B5B] hover:bg-[#FAF7F2] transition flex items-center justify-center space-x-1 mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>カラーを追加</span>
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFECE6] space-y-4">
          <h2 className="text-sm font-bold text-[#4A4033]">編み柄の管理</h2>
          <div className="space-y-3">
            {patterns.map((pat) => (
              <div key={pat.id} className="flex items-center space-x-3 bg-[#FAF7F2]/40 p-3 rounded-xl border border-[#EFECE6]">
                <div className="relative group cursor-pointer w-12 h-12 flex-shrink-0">
                  <img src={pat.image} alt={pat.name} className="w-12 h-12 rounded-lg object-cover border" />
                  <label className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white">
                    <ImageIcon className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload('pattern', null, null, pat.id, e)} className="hidden" />
                  </label>
                </div>
                <input
                  type="text"
                  value={pat.name}
                  onChange={(e) => updatePatternName(pat.id, e.target.value)}
                  className="flex-1 font-bold text-xs px-3 py-1.5 border border-[#DCD6CC] rounded-lg"
                />
                <button onClick={() => deletePattern(pat.id)} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {cropModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-[#4A4033]">画像をトリミング（正方形）</h3>
            
            <div 
              className="relative w-64 h-64 mx-auto overflow-hidden border-2 border-dashed border-[#C4A47C] rounded-xl bg-gray-100 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => {
                isDragging.current = true;
                dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
              }}
              onMouseMove={(e) => {
                if (!isDragging.current) return;
                setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
              }}
              onMouseUp={() => { isDragging.current = false; }}
              onMouseLeave={() => { isDragging.current = false; }}
            >
              <img 
                src={cropModal.imgUrl} 
                alt="Crop preview" 
                style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
                className="absolute max-none select-none pointer-events-none origin-center"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#8C7C6C]">
                <span>縮放</span>
                <span>{scale.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.1" 
                value={scale} 
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-[#C4A47C]" 
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setCropModal({ open: false, type: null, matId: null, colorId: null, patId: null, imgUrl: '' })}
                className="flex-1 bg-gray-100 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition"
              >
                キャンセル
              </button>
              <button
                onClick={handleCropComplete}
                className="flex-1 bg-[#A67B5B] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#956D4F] transition shadow"
              >
                決定・適用
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
