import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { TransactionType } from "../types";

export interface SampleTransaction {
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

// 収入カテゴリと説明のサンプルデータ
const incomeCategories = [
  {
    name: "給与",
    descriptions: ["基本給", "残業代", "賞与", "手当"],
  },
  {
    name: "ボーナス",
    descriptions: ["夏のボーナス", "冬のボーナス", "決算賞与", "特別賞与"],
  },
  {
    name: "副業",
    descriptions: [
      "フリーランス",
      "アルバイト",
      "ウーバーイーツ",
      "ブログ収入",
    ],
  },
  {
    name: "投資",
    descriptions: ["配当金", "株式売却益", "仮想通貨", "不動産収入"],
  },
  {
    name: "その他収入",
    descriptions: ["お祝い金", "還付金", "売上", "臨時収入"],
  },
];

// 支出カテゴリと説明のサンプルデータ
const expenseCategories = [
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

// ランダムな金額生成
const getRandomAmount = (type: TransactionType, category: string): number => {
  if (type === "income") {
    switch (category) {
      case "給与":
        return Math.floor(Math.random() * 100000) + 200000; // 200,000-300,000円
      case "ボーナス":
        return Math.floor(Math.random() * 300000) + 200000; // 200,000-500,000円
      case "副業":
        return Math.floor(Math.random() * 50000) + 10000; // 10,000-60,000円
      case "投資":
        return Math.floor(Math.random() * 20000) + 5000; // 5,000-25,000円
      default:
        return Math.floor(Math.random() * 30000) + 5000; // 5,000-35,000円
    }
  } else {
    switch (category) {
      case "食費":
        return Math.floor(Math.random() * 3000) + 300; // 300-3,300円
      case "交通費":
        return Math.floor(Math.random() * 1500) + 200; // 200-1,700円
      case "娯楽":
        return Math.floor(Math.random() * 5000) + 500; // 500-5,500円
      case "日用品":
        return Math.floor(Math.random() * 2000) + 100; // 100-2,100円
      case "衣服":
        return Math.floor(Math.random() * 10000) + 1000; // 1,000-11,000円
      case "医療費":
        return Math.floor(Math.random() * 5000) + 500; // 500-5,500円
      default:
        return Math.floor(Math.random() * 3000) + 200; // 200-3,200円
    }
  }
};

// 過去30日のランダムな日付生成
const getRandomDate = (): string => {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const randomDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return randomDate.toISOString().split("T")[0];
};

// サンプルデータ生成
export const generateSampleTransactions = (
  count: number = 50,
): SampleTransaction[] => {
  const sampleData: SampleTransaction[] = [];

  for (let i = 0; i < count; i++) {
    // 収入:支出 = 1:3 の割合で生成
    const isIncome = Math.random() < 0.25;
    const type: TransactionType = isIncome ? "income" : "expense";

    const categories = type === "income" ? incomeCategories : expenseCategories;
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomDescription =
      randomCategory.descriptions[
        Math.floor(Math.random() * randomCategory.descriptions.length)
      ];

    sampleData.push({
      amount: getRandomAmount(type, randomCategory.name),
      type,
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
    const sampleTransactions = generateSampleTransactions(count);
    const transactionsRef = collection(db, `users/${userId}/transactions`);

    console.log(`${count}件のサンプルデータ（収支混合）を追加中...`);

    const promises = sampleTransactions.map((transaction) => {
      return addDoc(transactionsRef, {
        ...transaction,
        createdAt: new Date(transaction.date + "T12:00:00"),
        updatedAt: new Date(),
      });
    });

    await Promise.all(promises);
    console.log(`✅ ${count}件のサンプルデータを正常に追加しました！`);

    // 収支内訳をログ出力
    const incomeCount = sampleTransactions.filter(
      (t) => t.type === "income",
    ).length;
    const expenseCount = sampleTransactions.filter(
      (t) => t.type === "expense",
    ).length;
    console.log(`📊 内訳: 収入${incomeCount}件, 支出${expenseCount}件`);
  } catch (error) {
    console.error("❌ サンプルデータの追加に失敗:", error);
    throw error;
  }
};

// サンプルデータをJSONで出力（デバッグ用）
export const exportSampleDataAsJson = (count: number = 10) => {
  const data = generateSampleTransactions(count);
  console.log("📊 サンプルデータ (JSON):");
  console.log(JSON.stringify(data, null, 2));
  return data;
};
