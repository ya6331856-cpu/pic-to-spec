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
        about: [
          {
            "@type": "Thing",
            name,
            description,
          },
          ...features.map(feature => ({
            "@type": "Thing",
            name: feature,
          })),
        ],
        additionalType: `https://schema.org/${applicationCategory}`,
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
