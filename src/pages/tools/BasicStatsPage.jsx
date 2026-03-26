import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import BasicStats from '@/tools/academic/BasicStats';

function BasicStatsExtras() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Related Tips</h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
        <li>Make sure to double check your inputs.</li>
        <li>Explore related tools in this category to streamline your work.</li>
      </ul>
    </div>
  );
}

export default function BasicStatsPage() {
  return (
    <ToolPageLayout
      title="Basic Stats"
      icon="🚀"
      extraFeatures={<BasicStatsExtras />}
      adClient={import.meta.env.VITE_ADSENSE_PUB_ID}
      adSlots={{
        video: import.meta.env.VITE_VIDEO_AD_SLOT,
        top: import.meta.env.VITE_BANNER_AD_SLOT,
        middle: import.meta.env.VITE_DISPLAY_AD_SLOT,
        bottom: import.meta.env.VITE_BANNER_AD_SLOT,
      }}
    >
      <BasicStats />
    </ToolPageLayout>
  );
}
