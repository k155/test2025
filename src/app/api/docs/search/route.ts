import { source, i18n } from "@/lib/source";
import { createI18nSearchAPI } from "fumadocs-core/search/server";
import { createTokenizer as createMandarinTokenizer } from "@orama/tokenizers/mandarin";

type LangPages = { language: string; pages: Array<{ url: string; data: any }> };

const searchAPI = createI18nSearchAPI("advanced", {
  i18n,

  indexes: (source.getLanguages() as LangPages[]).flatMap(({ language, pages }) =>
    pages.map((page) => ({
      id: page.url,
      url: page.url,
      title: page.data?.title,
      description: page.data?.description,
      structuredData: page.data?.structuredData,
      locale: language,
    }))
  ),

  localeMap: {
    zh: {
      components: {
        tokenizer: createMandarinTokenizer(),
      },
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },
    en: "english",
  },

  search: {
    limit: 20,
  },
});

export const GET = (request: Request) => searchAPI.GET(request);

