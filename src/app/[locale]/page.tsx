import { getLatestArticles } from '@/lib/getLatestArticles'
import { buildModuleLinkMap } from '@/lib/buildModuleLinkMap'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import type { Language } from '@/lib/content'
import type { Locale } from '@/i18n/routing'
import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

const SITE_NAME = 'Shinobi Way Wiki'
const GAME_NAME = 'Shinobi Way'
const SITE_TITLE = 'Shinobi Way Wiki - Codes, Lineages & Jutsu Guide'
const SITE_DESCRIPTION = 'Find Shinobi Way codes, lineage guides, jutsu builds, quests, stats, and beginner tips for the Roblox ninja RPG by Ouro Games, with fresh rewards.'
const ROBLOX_GAME_URL = 'https://www.roblox.com/games/104741933311544/Shinobi-Way'
const ROBLOX_COMMUNITY_URL = 'https://www.roblox.com/communities/33074137/Ouro-Games'
const DISCORD_URL = 'https://discord.com/invite/qPfAd6pznb'
const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=oc7Pqw6ZwJU'

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://shinobiway.wiki').replace(/\/+$/, '')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = getSiteUrl()
  const heroImageUrl = new URL('/images/hero.webp', siteUrl).toString()

  return {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    alternates: buildLanguageAlternates('/', locale as Locale, siteUrl),
    openGraph: {
      type: 'website',
      locale,
      url: locale === 'en' ? siteUrl : `${siteUrl}/${locale}`,
      siteName: SITE_NAME,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: heroImageUrl,
          width: 768,
          height: 432,
          alt: `${GAME_NAME} Roblox ninja RPG hero image`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [heroImageUrl],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const siteUrl = getSiteUrl()
  const heroImageUrl = new URL('/images/hero.webp', siteUrl).toString()
  const homeUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": SITE_NAME,
        "description": SITE_DESCRIPTION,
        "image": {
          "@type": "ImageObject",
          "url": heroImageUrl,
          "width": 768,
          "height": 432,
          "caption": `${GAME_NAME} Wiki hero image`,
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": SITE_NAME,
        "alternateName": GAME_NAME,
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": new URL('/android-chrome-512x512.png', siteUrl).toString(),
          "width": 512,
          "height": 512,
        },
        "image": {
          "@type": "ImageObject",
          "url": heroImageUrl,
          "width": 768,
          "height": 432,
          "caption": `${GAME_NAME} Wiki - Roblox ninja RPG guides`,
        },
        "sameAs": [
          ROBLOX_GAME_URL,
          ROBLOX_COMMUNITY_URL,
          DISCORD_URL,
          YOUTUBE_VIDEO_URL,
        ],
      },
      {
        "@type": "VideoGame",
        "name": GAME_NAME,
        "url": ROBLOX_GAME_URL,
        "gamePlatform": ["Roblox"],
        "applicationCategory": "Game",
        "genre": ["Roblox", "Ninja RPG", "Adventure", "PvP"],
        "publisher": {
          "@type": "Organization",
          "name": "Ouro Games",
          "url": ROBLOX_COMMUNITY_URL,
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": ROBLOX_GAME_URL,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${homeUrl}#webpage`,
        "url": homeUrl,
        "name": SITE_TITLE,
        "description": SITE_DESCRIPTION,
        "isPartOf": {
          "@id": `${siteUrl}/#website`,
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": heroImageUrl,
        },
      },
    ],
  }

  // 服务器端获取最新文章数据
  const latestArticles = await getLatestArticles(locale as Language, 30)
  const moduleLinkMap = await buildModuleLinkMap(locale as Language)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageClient latestArticles={latestArticles} moduleLinkMap={moduleLinkMap} locale={locale} />
    </>
  )
}
