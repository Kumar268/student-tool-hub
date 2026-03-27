import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { tools, categories } from '../data/tools';

/**
 * Breadcrumb Navigation Component — Phase 1.2
 * ─────────────────────────────────────────────────
 * Features:
 * - Dynamic path from current route
 * - Clickable navigation segments
 * - Home > Category > Tool Name structure
 * - Mobile-optimized (scrollable on small screens)
 * - JSON-LD breadcrumb schema for SEO
 * - Accessibility: ARIA labels, semantic HTML
 */
const Breadcrumb = ({ isDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toolId } = useParams();

  // Parse route and build breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Home', path: '/', icon: true }
    ];

    const pathname = location.pathname;

    // Route: /category/:categoryId
    if (pathname.includes('/category/')) {
      const catId = pathname.split('/category/')[1];
      const catInfo = categories.find(c => c.id === catId);
      if (catInfo) {
        items.push({
          label: catInfo.name,
          path: `/category/${catId}`
        });
      }
    }

    // Route: /tools/:category/:toolId
    if (pathname.includes('/tools/')) {
      const [, , cat, slug] = pathname.split('/');
      const catInfo = categories.find(c => c.id === cat);
      const toolInfo = tools.find(t => t.slug === slug);

      if (catInfo) {
        items.push({
          label: catInfo.name,
          path: `/category/${cat}`
        });
      }

      if (toolInfo) {
        items.push({
          label: toolInfo.name,
          path: location.pathname,
          current: true
        });
      }
    }

    // Route: /tool/:toolId (legacy route support)
    if (pathname.startsWith('/tool/') && !pathname.includes('/tools/')) {
      const toolInfo = tools.find(t => t.slug === toolId);
      if (toolInfo) {
        const catInfo = categories.find(c => c.id === toolInfo.category);
        if (catInfo) {
          items.push({
            label: catInfo.name,
            path: `/category/${toolInfo.category}`
          });
        }
        items.push({
          label: toolInfo.name,
          path: location.pathname,
          current: true
        });
      }
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbItems();

  // Generate JSON-LD schema for SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${window.location.origin}${item.path}`
    }))
  };

  // Hide breadcrumb if on home page
  if (breadcrumbs.length <= 1) {
    return (
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    );
  }

  return (
    <>
      {/* JSON-LD Breadcrumb Schema for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className={`px-4 py-3 border-b overflow-x-auto ${
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <ol className="flex items-center gap-2 min-w-max md:min-w-0">
          {breadcrumbs.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {/* Separator (chevron) — hide on first item */}
              {index > 0 && (
                <ChevronRight
                  size={16}
                  className={`flex-shrink-0 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Breadcrumb Link or Span */}
              {item.current ? (
                // Current page — not clickable
                <span
                  className={`text-sm font-semibold truncate ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                  aria-current="page"
                >
                  {item.icon ? (
                    <>
                      <Home size={16} className="inline mr-1" />
                      {item.label}
                    </>
                  ) : (
                    item.label
                  )}
                </span>
              ) : (
                // Clickable navigation item
                <button
                  onClick={() => navigate(item.path)}
                  className={`text-sm font-medium hover:underline transition-colors truncate ${
                    isDarkMode
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.icon ? (
                    <>
                      <Home size={16} className="inline mr-1" />
                      {item.label}
                    </>
                  ) : (
                    item.label
                  )}
                </button>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;
