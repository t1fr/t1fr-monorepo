import type { TranslateOptions } from "nestjs-i18n";

export type AdvanceTranslateOptions = TranslateOptions & { interpolate?: Record<string, string> }