/**
 * WRAPPER PAGE TEMPLATE
 * 
 * Copy this template and fill in:
 * 1. ComponentName - the actual tool component name
 * 2. tool-name - the display name of the tool
 * 3. category - the folder under src/tools/{category}
 * 4. emoji - appropriate emoji for the tool
 * 5. Customize extras section with tips relevant to the tool
 */

import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';

// ── CHANGE THIS: Import the actual tool component
import ToolComponent from '@/tools/category/ToolComponent';

function ToolComponentExtras() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        💡 Quick Tips
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
        <li>Tip 1: Customize this section for your tool</li>
        <li>Tip 2: Add relevant hints or best practices</li>
        <li>Tip 3: Link to related tools or documentation</li>
      </ul>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3">
          📚 Related Tools
        </h4>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Check out similar tools to enhance your workflow.
        </p>
      </div>
    </div>
  );
}

export default function ToolComponentPage() {
  return (
    <ToolPageLayout
      title="Tool Display Name"
      icon="⚙️"
      extraFeatures={<ToolComponentExtras />}
      adClient={import.meta.env.VITE_ADSENSE_PUB_ID}
      adSlots={{
        video: import.meta.env.VITE_VIDEO_AD_SLOT,
        top: import.meta.env.VITE_BANNER_AD_SLOT,
        middle: import.meta.env.VITE_DISPLAY_AD_SLOT,
        bottom: import.meta.env.VITE_BANNER_AD_SLOT,
      }}
    >
      <ToolComponent isDarkMode={false} />
    </ToolPageLayout>
  );
}
