type ApplicationCategory =
  | "DeveloperApplication"
  | "UtilitiesApplication"
  | "EducationalApplication"
  | "BusinessApplication"
  | "FinanceApplication";

type ToolStructuredDataProps = {
  path: string;
  name: string;
  description: string;
  applicationCategory?: ApplicationCategory;
  features?: string[];
};

export default function ToolStructuredData({
  path,
  name,
  description,
  applicationCategory = "UtilitiesApplication",
  features = [],
}: ToolStructuredDataProps) {
  const url = `https://pictospec.com${path}`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: "en",
        isPartOf: { "@id": "https://pictospec.com/#website" },
        mainEntity: { "@id": `${url}#software` },
      },
      {
        "@type": ["SoftwareApplication", "WebApplication"],
        "@id": `${url}#software`,
        name,
        description,
        url,
        applicationCategory,
        operatingSystem: "Any",
        browserRequirements: "A modern web browser with JavaScript enabled",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        ...(features.length ? { featureList: features } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://pictospec.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
