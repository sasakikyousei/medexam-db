import { client } from '@/lib/graphql';
import { GET_QUESTIONS_BY_BLOCK } from '@/lib/queries';
import Link from 'next/link';

type Props = {
  params: { blockId: string };
};

export default async function QuestionBlockPage({ params }: Props) {
  const blockId = params.blockId;
  const year = parseInt(blockId.slice(0, 3), 10);
  const block = blockId.slice(3);

  const { data } = await client.query({
    query: GET_QUESTIONS_BY_BLOCK,
    variables: { year, block },
  });

  const questions = data.questions;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        第{year}回 {block}ブロック
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-[600px] border border-gray-300 ">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border ">問題番号</th>
              <th className="px-4 py-2 border min-w-[300px]">問題文</th>
              <th className="px-4 py-2 border min-w-[100px]">科目</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(
              (q: {
                question_number: string;
                text: string;
                department?: { name?: string };
              }) => (
                <tr key={q.question_number} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-black text-blue-800 font-medium ">
                    <Link href={`/questions/${q.question_number}`}>
                      {q.question_number}
                    </Link>
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-800 max-w-[100px] truncate">
                    {q.text.length > 15 ? q.text.slice(0, 15) + '...' : q.text}
                  </td>
                  <td className="px-4 py-2 border text-sm text-gray-600 max-w-[50px] truncate">
                    {q.department?.name ?? '未設定'}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-6">
        <Link href="/">
          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            トップに戻る
          </button>
        </Link>
      </div>
    </div>
  );
}
