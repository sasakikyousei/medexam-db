import { client } from '@/lib/graphql';
import { GET_QUESTION_BY_NUMBER } from '@/lib/queries';
import Link from 'next/link'; // ← トップに戻るリンク用

type Props = {
  params: { questionNumber: string };
};

export default async function QuestionPage(props: Props) {
  const questionNumber = props.params.questionNumber;

  const { data } = await client.query({
    query: GET_QUESTION_BY_NUMBER,
    variables: { questionNumber },
  });

  const question = data.questions[0];

  if (!question) {
    return <div className="p-6 text-red-600">問題が見つかりませんでした。</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        問題番号: {question.question_number}
      </h1>

      <p className="whitespace-pre-line">{question.text}</p>

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
