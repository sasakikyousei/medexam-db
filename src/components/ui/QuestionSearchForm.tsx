'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function QuestionSearchForm() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/questions/${query.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="例: 118A01"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-4 py-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        表示
      </button>
    </form>
  );
}
