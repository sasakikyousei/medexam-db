'use client';

import { useEffect, useState } from 'react';
import { client } from '@/lib/graphql';
import { GET_QUESTION_BY_NUMBER } from '@/lib/queries';
import { UPDATE_QUESTION } from '@/lib/mutations';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';


// Supabase 初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 型定義
type QuestionImage = {
  image_url: string;
};

type Question = {
  id: string;
  question_number: string;
  text: string;
  explanation: string;
  correct_answers: string[];
  question_images: QuestionImage[]; // ✅ optionalではなく明示的に配列とする
};

// type Props = {
//   params: { questionNumber: string };
// };

export default function QuestionPage() {
  const params = useParams();
  const questionNumber = params.questionNumber as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(true);



useEffect(() => {
  const fetchUserAndData = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const role = userData?.user?.user_metadata?.role;
      if (role === 'admin') setIsAdmin(true);

      const { data } = await client.query({
        query: GET_QUESTION_BY_NUMBER,
        variables: { questionNumber },
      });

      const q = data.questions[0];

      if (q) {
        setQuestion(q);
        setText(q.text);
        setExplanation(q.explanation);
      } else {
        setQuestion(null); // 明示的にnull（なくてもOKだが明確にする）
      }
    } catch (err) {
      console.error('データ取得中にエラー:', err);
      setQuestion(null); // 念のためエラー時にも null にする
    } finally {
      setIsLoading(false); // 成功/失敗どちらでも最後に呼ぶ
    }
  };

  fetchUserAndData();
}, [questionNumber]);


if (isLoading) {
  return <div className="p-6 text-gray-500">読み込み中...</div>;
}

if (!question) {
  return <div className="p-6 text-red-600">問題が見つかりませんでした。</div>;
}


  const handleSave = async () => {
    if (!question) return;

    await client.mutate({
      mutation: UPDATE_QUESTION,
      variables: {
        id: question.id,
        text,
        explanation,
      },
    });

    setQuestion({ ...question, text, explanation });
    setIsEditing(false);
  };

  if (!question) {
    return <div className="p-6 text-red-600">問題が見つかりませんでした。</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        問題番号: {question.question_number}
      </h1>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border p-2"
            rows={5}
          />
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="w-full border p-2"
            rows={4}
          />
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            保存
          </button>
        </div>
      ) : (
        <>
          <p className="whitespace-pre-line mb-10">{question.text}</p>

          {question.question_images.length > 0 && (
            <div className="space-y-4">
              {question.question_images.map((img, index) => (
                <div
                  key={index}
                  className="relative w-full max-w-[600px] aspect-[4/3]"
                >
                  <Image
                    src={img.image_url}
                    alt={`問題画像 ${index + 1}`}
                    fill
                    className="object-contain rounded border"
                  />
                </div>
              ))}
            </div>
          )}

          {question.explanation && (
            <div>
              <h2 className="font-bold text-lg mb-1">解説</h2>
              <p className="whitespace-pre-line text-gray-800">
                {question.explanation}
              </p>
            </div>
          )}

          <div>
            <h2 className="font-bold text-lg mb-1">正解</h2>
            <div className="text-green-600 font-semibold">
              {question.correct_answers.join(', ')}
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              編集
            </button>
          )}
        </>
      )}

      <div className="pt-6">
        <Link href="/">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            トップに戻る
          </button>
        </Link>
      </div>
    </div>
  );
}
