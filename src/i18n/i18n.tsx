import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { translations, type Lang } from './translations'

type Translator = (key: string, ...args: unknown[]) => string

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translator
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLang(): Lang {
  try {
    const saved = window.localStorage.getItem('little-math-lang')
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    // fall through, use browser language
  }
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = lang === 'zh'
      ? '小小数学家 | 让数学动起来'
      : 'Little Math Explorer | Making math move'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', lang === 'zh'
      ? '一个让数学动起来的小学互动学习空间'
      : 'An interactive math learning space for primary school')
  }, [lang])

  const t = useMemo(() => (key: string, ...args: unknown[]) => {
    const value = (translations[lang] as Record<string, unknown>)[key]
    if (typeof value === 'function') return (value as (...a: unknown[]) => string)(...args)
    return value as string
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem('little-math-lang', next)
    } catch {
      // ignore
    }
  }

  const value = useMemo<LanguageContextValue>(() => ({ lang, setLang, t }), [lang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}

export function useTranslate() {
  return useLanguage().t
}
