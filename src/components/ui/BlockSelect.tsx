// src/components/ui/BlockSelect.tsx

'use client';

import { useRouter } from 'next/navigation';

const BlockSelect = () => {
  const router = useRouter();

  const handleClick = (blockId: string) => {
    router.push(`/questions/blocks/${blockId}`);

  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">回数別検索</h2>
      <div className="flex gap-4 flex-wrap">
        {/* 118回だけ仮で表示 */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => handleClick('118A')}
        >
          118-A
        </button>
        {/* 今後：118B〜などのブロックも増やせる */}
      </div>
    </div>
  );
};

export default BlockSelect;
