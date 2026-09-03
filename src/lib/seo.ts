import type { Metadata } from "next";
import { siteConfig } from "./site-config";

interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

export function buildMetadata({ title, description, path, ogImage }: PageSeoInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const image = ogImage ?? `${siteConfig.url}/og/campusos-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.parentBrand,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [image],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MSM Unify",
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      "https://www.linkedin.com/company/msm-unify/",
      "https://www.facebook.com/msmunify",
      "https://www.instagram.com/msmunify/",
    ],
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  industry: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `${siteConfig.name} for ${input.industry}`,
    name: input.name,
    description: input.description,
    url: `${siteConfig.url}${input.path}`,
    provider: {
      "@type": "Organization",
      name: "MSM Unify",
      url: siteConfig.url,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Global",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
