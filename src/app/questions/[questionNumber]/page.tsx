'use client';

import { useEffect, useState } from 'react';
import { client } from '@/lib/graphql';
import { GET_QUESTION_BY_NUMBER } from '@/lib/queries';
import { UPDATE_QUESTION } from '@/lib/mutations';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useParams, useRouter } from 'next/navigation';

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
  question_images: QuestionImage[];
};

// 前後の問題番号を計算
function getNextQuestionNumber(current: string): string {
  const match = current.match(/^(\d+[A-Z])(\d{2})$/);
  if (!match) return current;
  const prefix = match[1];
  const number = parseInt(match[2], 10);
  const next = (number + 1).toString().padStart(2, '0');
  return `${prefix}${next}`;
}

function getPrevQuestionNumber(current: string): string {
  const match = current.match(/^(\d+[A-Z])(\d{2})$/);
  if (!match) return current;
  const prefix = match[1];
  const number = parseInt(match[2], 10);
  if (number <= 1) return current;
  const prev = (number - 1).toString().padStart(2, '0');
  return `${prefix}${prev}`;
}

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
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
          setQuestion(null);
        }
      } catch (err) {
        console.error('データ取得エラー:', err);
        setQuestion(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndData();
  }, [questionNumber]);

  const handleSave = async () => {
    if (!question) return;

    try {
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
    } catch (err) {
      console.error('保存エラー:', err);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">読み込み中...</div>;
  }

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
            placeholder="問題文を入力してください"
          />
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="w-full border p-2"
            rows={4}
            placeholder="解説を入力してください"
          />

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={!text.trim() || !explanation.trim()}
              className={`px-4 py-2 rounded text-white ${
                !text.trim() || !explanation.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              保存
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setText(question.text);
                setExplanation(question.explanation);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              キャンセル
            </button>
          </div>
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

      {/* 前後の問題ボタン */}
      <div className="flex gap-4 pt-6">
        <button
          onClick={() =>
            router.push(`/questions/${getPrevQuestionNumber(questionNumber)}`)
          }
          disabled={getPrevQuestionNumber(questionNumber) === questionNumber}
          className="px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ← 前の問題
        </button>

        <button
          onClick={() =>
            router.push(`/questions/${getNextQuestionNumber(questionNumber)}`)
          }
          className="px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700"
        >
          次の問題 →
        </button>
      </div>

      <div className="pt-4">
        <Link href="/">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            トップに戻る
          </button>
        </Link>
      </div>
    </div>
  );
}
