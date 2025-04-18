import { client } from '@/lib/graphql';
import { GET_QUESTION_BY_NUMBER } from '@/lib/queries';

type Props = {
  params: { questionNumber: string };
};

export default async function QuestionPage(props: Props) {
  const questionNumber  = props.params.questionNumber;

  const { data } = await client.query({
    query: GET_QUESTION_BY_NUMBER,
    variables: { questionNumber },
  });

  const question = data.questions[0];

  if (!question) {
    return <div className="p-6 text-red-600">問題が見つかりませんでした。</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        問題番号: {question.question_number}
      </h1>
      <p className="whitespace-pre-line">{question.text}</p>
      <div className="text-green-600 font-semibold">
        正解: {question.correct_answers.join(', ')}
      </div>
      {question.explanation && (
        <div className="pt-4">
          <h2 className="font-bold">解説</h2>
          <p className="whitespace-pre-line">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
