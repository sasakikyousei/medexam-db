import BlockSelect from '../ui/BlockSelect';
import QuestionSearchForm from '../ui/QuestionSearchForm';

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">問題番号で検索</h1>
      <QuestionSearchForm />

      <BlockSelect/>
    </main>
  );
}
