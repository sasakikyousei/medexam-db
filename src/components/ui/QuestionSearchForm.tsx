'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function QuestionSearchForm() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ← ローディング状態
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      setIsLoading(true); // ← ローディング開始
      router.push(`/questions/${query.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-8">
      <input
        type="text"
        placeholder="例: 118A01"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-4 py-2 rounded"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? '読み込み中...' : '表示'}
      </button>

      {isLoading && (
        <div className="ml-2 animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600"></div>
      )}
    </form>
  );
}
