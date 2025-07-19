import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebase";

export interface SampleExpense {
  amount: number;
  category: string;
  description: string;
  date: string;
}

// カテゴリと説明のサンプルデータ
const categories = [
  {
    name: "食費",
    descriptions: ["コンビニ", "スーパー", "外食", "カフェ", "お菓子"],
  },
  {
    name: "交通費",
    descriptions: ["電車", "バス", "タクシー", "ガソリン", "高速代"],
  },
  {
    name: "娯楽",
    descriptions: ["映画", "ゲーム", "本", "飲み会", "カラオケ"],
  },
  {
    name: "日用品",
    descriptions: ["洗剤", "シャンプー", "ティッシュ", "文具", "雑貨"],
  },
  {
    name: "衣服",
    descriptions: ["シャツ", "パンツ", "靴", "アクセサリー", "バッグ"],
  },
  {
    name: "医療費",
    descriptions: ["病院", "薬", "歯医者", "サプリ", "検査費"],
  },
  {
    name: "その他",
    descriptions: ["雑費", "手数料", "プレゼント", "寄付", "修理費"],
  },
];

// ランダムな金額生成（カテゴリ別に現実的な範囲）
const getRandomAmount = (category: string): number => {
  switch (category) {
    case "食費":
      return Math.floor(Math.random() * 3000) + 300; // 300-3300円
    case "交通費":
      return Math.floor(Math.random() * 1500) + 200; // 200-1700円
    case "娯楽":
      return Math.floor(Math.random() * 5000) + 500; // 500-5500円
    case "日用品":
      return Math.floor(Math.random() * 2000) + 100; // 100-2100円
    case "衣服":
      return Math.floor(Math.random() * 10000) + 1000; // 1000-11000円
    case "医療費":
      return Math.floor(Math.random() * 5000) + 500; // 500-5500円
    default:
      return Math.floor(Math.random() * 3000) + 200; // 200-3200円
  }
};

// 過去30日のランダムな日付生成
const getRandomDate = (): string => {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const randomDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return randomDate.toISOString().split("T")[0]; // YYYY-MM-DD形式
};

// サンプルデータ生成
export const generateSampleExpenses = (count: number = 50): SampleExpense[] => {
  const sampleData: SampleExpense[] = [];

  for (let i = 0; i < count; i++) {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomDescription =
      randomCategory.descriptions[
        Math.floor(Math.random() * randomCategory.descriptions.length)
      ];

    sampleData.push({
      amount: getRandomAmount(randomCategory.name),
      category: randomCategory.name,
      description: randomDescription,
      date: getRandomDate(),
    });
  }

  // 日付順にソート
  return sampleData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

// Firestoreにサンプルデータを追加する関数
export const addSampleDataToFirestore = async (
  userId: string,
  count: number = 50,
) => {
  try {
    const sampleExpenses = generateSampleExpenses(count);
    const expensesRef = collection(db, `users/${userId}/expenses`);

    console.log(`${count}件のサンプルデータを追加中...`);

    const promises = sampleExpenses.map((expense, index) => {
      return addDoc(expensesRef, {
        ...expense,
        createdAt: new Date(expense.date + "T12:00:00"), // 日付を適切なTimestamp形式に
        updatedAt: new Date(),
      });
    });

    await Promise.all(promises);
    console.log(`✅ ${count}件のサンプルデータを正常に追加しました！`);
  } catch (error) {
    console.error("❌ サンプルデータの追加に失敗:", error);
    throw error;
  }
};

// 開発用: コンソールからサンプルデータを追加
// 使用方法:
// import { addSampleDataToFirestore } from './utils/generateSampleData';
// addSampleDataToFirestore('your-user-id', 30);

// サンプルデータをJSONで出力（デバッグ用）
export const exportSampleDataAsJson = (count: number = 10) => {
  const data = generateSampleExpenses(count);
  console.log("📊 サンプルデータ (JSON):");
  console.log(JSON.stringify(data, null, 2));
  return data;
};
