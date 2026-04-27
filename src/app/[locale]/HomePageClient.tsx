'use client'

import { useEffect, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Eye,
  ExternalLink,
  Gamepad2,
  Hammer,
  Home,
  MessageCircle,
  Package,
  Settings,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'
import enMessages from '@/locales/en.json'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
}

const ROBLOX_GAME_URL = 'https://www.roblox.com/games/104741933311544/Shinobi-Way'
const ROBLOX_COMMUNITY_URL = 'https://www.roblox.com/communities/33074137/Ouro-Games'
const DISCORD_URL = 'https://discord.com/invite/qPfAd6pznb'
const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=oc7Pqw6ZwJU'

const jutsuPathIcons = [Hammer, Sparkles, Eye, Settings, Star, TrendingUp]
const statsRowIcons = [Shield, Hammer, Package, Sparkles, TrendingUp, Star]
const levelingStepIcons = [BookOpen, Star, Gamepad2, TrendingUp, ClipboardCheck, Shield, Settings]
const missionStepIcons = [ClipboardCheck, Clock, Star, Settings, Gamepad2, Shield, Eye]

export default function HomePageClient({ latestArticles, locale }: HomePageClientProps) {
  const rawMessages = useMessages() as any
  const t = rawMessages?.hero?.title === 'Shinobi Way Wiki' ? rawMessages : (enMessages as any)
  const heroPrimaryCTA = t.hero.playOnRobloxCTA || 'Play Shinobi Way on Roblox'
  const heroSecondaryCTA = t.hero.getFreeCodesCTA || 'Join Ouro Games Discord'

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href={ROBLOX_GAME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <Gamepad2 className="w-5 h-5" />
                {heroPrimaryCTA}
              </a>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {heroSecondaryCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="oc7Pqw6ZwJU"
              title="MY EXPERIENCE IN SHINOBI WAY: THE FIRST NARUTO GAME ON ROBLOX IN 2026"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <a
              href="#shinobi-way-codes"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-codes')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '0ms' }}
              aria-label={'Jump to ' + t.tools.cards[0].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[0].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[0].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[0].description}</p>
            </a>
            <a
              href="#shinobi-way-beginner-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-beginner-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '50ms' }}
              aria-label={'Jump to ' + t.tools.cards[1].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[1].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[1].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[1].description}</p>
            </a>
            <a
              href="#shinobi-way-official-links"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-official-links')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '100ms' }}
              aria-label={'Jump to ' + t.tools.cards[2].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[2].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[2].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[2].description}</p>
            </a>
            <a
              href="#shinobi-way-lineage-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-lineage-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '150ms' }}
              aria-label={'Jump to ' + t.tools.cards[3].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[3].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[3].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[3].description}</p>
            </a>
            <a
              href="#shinobi-way-jutsu-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-jutsu-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '200ms' }}
              aria-label={'Jump to ' + t.tools.cards[4].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[4].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[4].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[4].description}</p>
            </a>
            <a
              href="#shinobi-way-stats-and-builds"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-stats-and-builds')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '250ms' }}
              aria-label={'Jump to ' + t.tools.cards[5].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[5].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[5].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[5].description}</p>
            </a>
            <a
              href="#shinobi-way-leveling-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-leveling-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '300ms' }}
              aria-label={'Jump to ' + t.tools.cards[6].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[6].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[6].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[6].description}</p>
            </a>
            <a
              href="#shinobi-way-missions-and-daily-quests"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-missions-and-daily-quests')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '350ms' }}
              aria-label={'Jump to ' + t.tools.cards[7].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[7].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[7].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[7].description}</p>
            </a>
            <a
              href="#shinobi-way-boss-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-boss-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '400ms' }}
              aria-label={'Jump to ' + t.tools.cards[8].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[8].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[8].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[8].description}</p>
            </a>
            <a
              href="#shinobi-way-pvp-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-pvp-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '450ms' }}
              aria-label={'Jump to ' + t.tools.cards[9].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[9].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[9].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[9].description}</p>
            </a>
            <a
              href="#shinobi-way-map-and-village-secrets"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-map-and-village-secrets')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '500ms' }}
              aria-label={'Jump to ' + t.tools.cards[10].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[10].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[10].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[10].description}</p>
            </a>
            <a
              href="#shinobi-way-weapons-and-taijutsu-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-weapons-and-taijutsu-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '550ms' }}
              aria-label={'Jump to ' + t.tools.cards[11].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[11].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[11].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[11].description}</p>
            </a>
            <a
              href="#shinobi-way-spins-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-spins-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '600ms' }}
              aria-label={'Jump to ' + t.tools.cards[12].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[12].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[12].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[12].description}</p>
            </a>
            <a
              href="#shinobi-way-farming-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-farming-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '650ms' }}
              aria-label={'Jump to ' + t.tools.cards[13].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[13].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[13].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[13].description}</p>
            </a>
            <a
              href="#shinobi-way-gamepasses-and-store"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-gamepasses-and-store')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '700ms' }}
              aria-label={'Jump to ' + t.tools.cards[14].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[14].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[14].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[14].description}</p>
            </a>
            <a
              href="#shinobi-way-updates-and-release-tracker"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('shinobi-way-updates-and-release-tracker')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--nav-theme)/0.45)]"
              style={{ animationDelay: '750ms' }}
              aria-label={'Jump to ' + t.tools.cards[15].title}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[15].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[15].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[15].description}</p>
            </a>
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Shinobi Way Codes */}
      <section id="shinobi-way-codes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.shinobiWayCodes.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayCodes.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayCodes.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayCodes.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">{t.modules.shinobiWayCodes.workingCodesTitle}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {t.modules.shinobiWayCodes.codes.map((code: any, index: number) => (
                  <div key={index} className="p-5 rounded-xl border border-[hsl(var(--nav-theme)/0.28)] bg-[hsl(var(--nav-theme)/0.06)] hover:border-[hsl(var(--nav-theme)/0.55)] transition-colors">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <code className="text-lg font-bold tracking-wide text-[hsl(var(--nav-theme-light))]">{code.code}</code>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)]">{code.status}</span>
                    </div>
                    <p className="font-semibold mb-2">{code.reward}</p>
                    <p className="text-sm text-muted-foreground">{code.bestFor}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-xl border border-border bg-white/5">
                <h3 className="font-bold mb-3">{t.modules.shinobiWayCodes.expiredCodesTitle}</h3>
                {t.modules.shinobiWayCodes.expired.map((code: any, index: number) => (
                  <div key={index} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm">
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">{code.code}</span>
                    <span className="text-muted-foreground">{code.reward}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="text-xl font-bold mb-5">{t.modules.shinobiWayCodes.redeemTitle}</h3>
              <div className="space-y-4">
                {t.modules.shinobiWayCodes.redeemSteps.map((step: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[hsl(var(--nav-theme)/0.14)] border border-[hsl(var(--nav-theme)/0.35)] flex items-center justify-center text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="scroll-reveal p-6 rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">{t.modules.shinobiWayCodes.quickTipsTitle}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {t.modules.shinobiWayCodes.tips.map((tip: string, index: number) => (
                <p key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span>{tip}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Shinobi Way Beginner Guide */}
      <section id="shinobi-way-beginner-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.shinobiWayBeginnerGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayBeginnerGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayBeginnerGuide.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayBeginnerGuide.intro}</p>
          </div>
          <div className="scroll-reveal relative space-y-5 mb-8">
            <div className="hidden md:block absolute left-6 top-8 bottom-8 w-px bg-[hsl(var(--nav-theme)/0.3)]" />
            {t.modules.shinobiWayBeginnerGuide.steps.map((step: any, index: number) => (
              <div key={index} className="relative flex gap-4 p-6 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="z-10 flex-shrink-0 w-12 h-12 rounded-full bg-background border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  <p className="text-sm text-[hsl(var(--nav-theme-light))]">{step.goal}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">{t.modules.shinobiWayBeginnerGuide.tipsTitle}</h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.modules.shinobiWayBeginnerGuide.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 3: Shinobi Way Official Links */}
      <section id="shinobi-way-official-links" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <MessageCircle className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.shinobiWayOfficialLinks.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayOfficialLinks.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayOfficialLinks.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayOfficialLinks.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.shinobiWayOfficialLinks.links.map((link: any, index: number) => (
              <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="group p-6 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.55)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{link.type}</span>
                    <h3 className="text-xl font-bold mt-3 group-hover:text-[hsl(var(--nav-theme-light))] transition-colors">{link.label}</h3>
                  </div>
                  <ExternalLink className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
                <p className="text-sm font-medium text-[hsl(var(--nav-theme-light))]">{link.bestFor}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Shinobi Way Lineage Guide */}
      <section id="shinobi-way-lineage-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.shinobiWayLineageGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayLineageGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayLineageGuide.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayLineageGuide.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.shinobiWayLineageGuide.tiers.map((tier: any, index: number) => (
              <div key={index} className="p-6 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="w-12 h-12 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] flex items-center justify-center text-xl font-bold text-[hsl(var(--nav-theme-light))]">{tier.tier}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{tier.priority}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{tier.label}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                <p className="text-sm mb-2"><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Best for: </span>{tier.bestFor}</p>
                <p className="text-sm text-muted-foreground">{tier.advice}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Shinobi Way Jutsu Guide */}
      <section id="shinobi-way-jutsu-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <Gamepad2 className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.shinobiWayJutsuGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayJutsuGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayJutsuGuide.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayJutsuGuide.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.shinobiWayJutsuGuide.items.map((item: any, index: number) => {
              const PathIcon = jutsuPathIcons[index % jutsuPathIcons.length]
              return (
                <div key={index} className="p-6 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center">
                      <PathIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-right">
                      {item.role}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">{t.modules.shinobiWayJutsuGuide.labels.bestFor}: </span>
                    {item.bestFor}
                  </p>
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase text-[hsl(var(--nav-theme-light))] mb-2">{t.modules.shinobiWayJutsuGuide.labels.buildFocus}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.buildFocus.map((focus: string, focusIndex: number) => (
                        <span key={focusIndex} className="px-2 py-1 rounded-md bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)] text-xs">
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{t.modules.shinobiWayJutsuGuide.labels.playTip}: </span>
                    {item.playTip}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 6: Shinobi Way Stats and Builds */}
      <section id="shinobi-way-stats-and-builds" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.shinobiWayStatsAndBuilds.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayStatsAndBuilds.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayStatsAndBuilds.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayStatsAndBuilds.intro}</p>
          </div>
          <div className="scroll-reveal overflow-hidden rounded-xl border border-border bg-card">
            <div className="hidden md:grid grid-cols-[180px_1.1fr_1.2fr_1.4fr_180px] gap-4 px-5 py-3 bg-[hsl(var(--nav-theme)/0.08)] text-sm font-semibold text-[hsl(var(--nav-theme-light))]">
              <span>{t.modules.shinobiWayStatsAndBuilds.tableHeaders.stat}</span>
              <span>{t.modules.shinobiWayStatsAndBuilds.tableHeaders.primaryRole}</span>
              <span>{t.modules.shinobiWayStatsAndBuilds.tableHeaders.bestFor}</span>
              <span>{t.modules.shinobiWayStatsAndBuilds.tableHeaders.buildDirection}</span>
              <span>{t.modules.shinobiWayStatsAndBuilds.tableHeaders.priority}</span>
            </div>
            {t.modules.shinobiWayStatsAndBuilds.rows.map((row: any, index: number) => {
              const StatIcon = statsRowIcons[index % statsRowIcons.length]
              return (
                <div key={index} className="grid grid-cols-1 md:grid-cols-[180px_1.1fr_1.2fr_1.4fr_180px] gap-3 md:gap-4 px-5 py-5 border-t border-border hover:bg-[hsl(var(--nav-theme)/0.04)] transition-colors">
                  <p className="font-bold flex items-center gap-2">
                    <StatIcon className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                    {row.stat}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="md:hidden block text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-1">{t.modules.shinobiWayStatsAndBuilds.tableHeaders.primaryRole}</span>
                    {row.primaryRole}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="md:hidden block text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-1">{t.modules.shinobiWayStatsAndBuilds.tableHeaders.bestFor}</span>
                    {row.bestFor}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="md:hidden block text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-1">{t.modules.shinobiWayStatsAndBuilds.tableHeaders.buildDirection}</span>
                    {row.buildDirection}
                  </p>
                  <p className="text-sm text-[hsl(var(--nav-theme-light))]">
                    <span className="md:hidden block text-xs font-semibold mb-1">{t.modules.shinobiWayStatsAndBuilds.tableHeaders.priority}</span>
                    {row.priority}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 7: Shinobi Way Leveling Guide */}
      <section id="shinobi-way-leveling-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.shinobiWayLevelingGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayLevelingGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayLevelingGuide.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayLevelingGuide.intro}</p>
          </div>
          <div className="scroll-reveal relative space-y-5">
            <div className="hidden md:block absolute left-7 top-8 bottom-8 w-px bg-[hsl(var(--nav-theme)/0.3)]" />
            {t.modules.shinobiWayLevelingGuide.steps.map((step: any, index: number) => {
              const StepIcon = levelingStepIcons[index % levelingStepIcons.length]
              return (
                <div key={index} className="relative flex flex-col md:flex-row gap-4 p-6 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="z-10 flex-shrink-0 w-14 h-14 rounded-full bg-background border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                    <StepIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                        {t.modules.shinobiWayLevelingGuide.labels.step} {step.step}
                      </span>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-4 rounded-lg bg-[hsl(var(--nav-theme)/0.06)] border border-[hsl(var(--nav-theme)/0.22)]">
                        <p className="text-xs font-semibold uppercase text-[hsl(var(--nav-theme-light))] mb-2">{t.modules.shinobiWayLevelingGuide.labels.action}</p>
                        <p className="text-sm text-muted-foreground">{step.action}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-background border border-border">
                        <p className="text-xs font-semibold uppercase text-[hsl(var(--nav-theme-light))] mb-2">{t.modules.shinobiWayLevelingGuide.labels.rewardFocus}</p>
                        <p className="text-sm text-muted-foreground">{step.rewardFocus}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 8: Shinobi Way Missions and Daily Quests */}
      <section id="shinobi-way-missions-and-daily-quests" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
              <ClipboardCheck className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.shinobiWayMissionsAndDailyQuests.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayMissionsAndDailyQuests.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayMissionsAndDailyQuests.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayMissionsAndDailyQuests.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.shinobiWayMissionsAndDailyQuests.steps.map((step: any, index: number) => {
              const MissionIcon = missionStepIcons[index % missionStepIcons.length]
              return (
                <div key={index} className="p-6 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] transition-all">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center">
                      <MissionIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {t.modules.shinobiWayMissionsAndDailyQuests.labels.step} {step.step}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-background border border-border text-[hsl(var(--nav-theme-light))]">
                        {step.priority}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  <div className="p-4 rounded-lg bg-[hsl(var(--nav-theme)/0.06)] border border-[hsl(var(--nav-theme)/0.22)]">
                    <p className="text-xs font-semibold uppercase text-[hsl(var(--nav-theme-light))] mb-2">{t.modules.shinobiWayMissionsAndDailyQuests.labels.rewardFocus}</p>
                    <p className="text-sm text-muted-foreground">{step.rewardFocus}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 9: Shinobi Way Boss Guide */}
      <section id="shinobi-way-boss-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayBossGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayBossGuide.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayBossGuide.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.shinobiWayBossGuide.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <Shield className="w-6 h-6 text-[hsl(var(--nav-theme-light))] mb-4" />
                <h3 className="font-bold text-lg mb-2">{card.name}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Shinobi Way PvP Guide */}
      <section id="shinobi-way-pvp-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayPvpGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayPvpGuide.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayPvpGuide.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.modules.shinobiWayPvpGuide.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <Gamepad2 className="w-6 h-6 text-[hsl(var(--nav-theme-light))] mb-4" />
                <h3 className="font-bold mb-2">{card.name}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Shinobi Way Map and Village Secrets */}
      <section id="shinobi-way-map-and-village-secrets" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayMapAndVillageSecrets.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayMapAndVillageSecrets.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayMapAndVillageSecrets.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.shinobiWayMapAndVillageSecrets.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <Eye className="w-6 h-6 text-[hsl(var(--nav-theme-light))] mb-4" />
                <h3 className="font-bold text-lg mb-2">{card.name}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 12: Shinobi Way Weapons and Taijutsu Guide */}
      <section id="shinobi-way-weapons-and-taijutsu-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayWeaponsAndTaijutsuGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayWeaponsAndTaijutsuGuide.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayWeaponsAndTaijutsuGuide.intro}</p>
          </div>
          <div className="scroll-reveal overflow-hidden rounded-xl border border-border bg-card">
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_2fr] gap-4 px-5 py-3 bg-[hsl(var(--nav-theme)/0.08)] text-sm font-semibold text-[hsl(var(--nav-theme-light))]">
              <span>Route</span><span>Best For</span><span>Stat Focus</span><span>Plan</span>
            </div>
            {t.modules.shinobiWayWeaponsAndTaijutsuGuide.rows.map((row: any, index: number) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_2fr] gap-3 md:gap-4 px-5 py-4 border-t border-border">
                <p className="font-bold flex items-center gap-2"><Hammer className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{row.route}</p>
                <p className="text-sm text-muted-foreground">{row.bestFor}</p>
                <p className="text-sm text-[hsl(var(--nav-theme-light))]">{row.statFocus}</p>
                <p className="text-sm text-muted-foreground">{row.plan}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 13: Shinobi Way Spins Guide */}
      <section id="shinobi-way-spins-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWaySpinsGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWaySpinsGuide.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWaySpinsGuide.intro}</p>
          </div>
          <div className="scroll-reveal space-y-3">
            {t.modules.shinobiWaySpinsGuide.questions.map((item: any, index: number) => (
              <details key={index} className="group border border-border rounded-xl bg-white/5 overflow-hidden">
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer hover:bg-[hsl(var(--nav-theme)/0.06)] transition-colors">
                  <span className="font-semibold">{item.question}</span>
                  <ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform group-open:rotate-180 text-[hsl(var(--nav-theme-light))]" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Module 14: Shinobi Way Farming Guide */}
      <section id="shinobi-way-farming-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayFarmingGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayFarmingGuide.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayFarmingGuide.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.shinobiWayFarmingGuide.steps.map((step: any, index: number) => (
              <div key={index} className="p-6 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">Route {index + 1}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 15: Shinobi Way Gamepasses and Store */}
      <section id="shinobi-way-gamepasses-and-store" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayGamepassesAndStore.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayGamepassesAndStore.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayGamepassesAndStore.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.modules.shinobiWayGamepassesAndStore.rows.map((row: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <Home className="w-6 h-6 text-[hsl(var(--nav-theme-light))] mb-4" />
                <h3 className="font-bold text-lg mb-2">{row.angle}</h3>
                <p className="text-sm text-[hsl(var(--nav-theme-light))] mb-3">{row.focus}</p>
                <p className="text-sm text-muted-foreground">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 16: Shinobi Way Updates and Release Tracker */}
      <section id="shinobi-way-updates-and-release-tracker" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.shinobiWayUpdatesAndReleaseTracker.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">{t.modules.shinobiWayUpdatesAndReleaseTracker.subtitle}</p>
            <p className="text-muted-foreground max-w-4xl mx-auto">{t.modules.shinobiWayUpdatesAndReleaseTracker.intro}</p>
          </div>
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-8">
            {t.modules.shinobiWayUpdatesAndReleaseTracker.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-card border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{entry.type}</span>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold mb-1">{entry.title}</h3>
                  <p className="text-muted-foreground text-sm">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-reveal mt-8 p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-start gap-3">
              <Package className="w-6 h-6 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[hsl(var(--nav-theme-light))] mb-2">Shinobi Way update channels</h3>
                <p className="text-sm text-muted-foreground mb-3">Use official Shinobi Way community channels for code alerts, update posts, and player discussion.</p>
                <div className="flex flex-wrap gap-3">
                  <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                    <MessageCircle className="w-4 h-4" /> Ouro Games Discord <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href={ROBLOX_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                    Ouro Games Roblox Group <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href={YOUTUBE_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href={ROBLOX_COMMUNITY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href={ROBLOX_GAME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-muted-foreground">
                    {t.footer.about}
                  </span>
                </li>
                <li>
                  <span className="text-muted-foreground">
                    {t.footer.privacy}
                  </span>
                </li>
                <li>
                  <span className="text-muted-foreground">
                    {t.footer.terms}
                  </span>
                </li>
                <li>
                  <span className="text-muted-foreground">
                    {t.footer.copyrightNotice}
                  </span>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
