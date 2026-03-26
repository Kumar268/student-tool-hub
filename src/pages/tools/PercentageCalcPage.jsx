import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import PercentageCalc from '@/tools/utility/PercentageCalc';

function PercentageCalcExtras() {
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

export default function PercentageCalcPage() {
  return (
    <ToolPageLayout
      title="Percentage Calc"
      icon="🚀"
      extraFeatures={<PercentageCalcExtras />}
      adClient={import.meta.env.VITE_ADSENSE_PUB_ID}
      adSlots={{
        video: import.meta.env.VITE_VIDEO_AD_SLOT,
        top: import.meta.env.VITE_BANNER_AD_SLOT,
        middle: import.meta.env.VITE_DISPLAY_AD_SLOT,
        bottom: import.meta.env.VITE_BANNER_AD_SLOT,
      }}
    >
      <PercentageCalc />
    </ToolPageLayout>
  );
}
