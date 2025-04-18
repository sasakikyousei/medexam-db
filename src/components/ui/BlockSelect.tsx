'use client';

import { useRouter } from 'next/navigation';

const BlockSelect = () => {
  const router = useRouter();

  const handleClick = (blockId: string) => {
    router.push(`/questions/blocks/${blockId}`);
  };

  // 表示する回数：115〜118
  const years = [118, 117, 116, 115];
  const blocks = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">回数別検索</h2>

      <div className="space-y-6">
        {years.map((year) => (
          <div key={year}>
            <h3 className="text-lg font-semibold mb-2">第{year}回</h3>
            <div className="flex flex-wrap gap-2">
              {blocks.map((block) => {
                const blockId = `${year}${block}`;
                return (
                  <button
                    key={blockId}
                    onClick={() => handleClick(blockId)}
                    className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {year}-{block}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockSelect;
