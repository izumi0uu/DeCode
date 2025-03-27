// src/types/api/website-configuration.ts
import { Media, Relation, StrapiResponse } from "./common";

/**
 * 网站配置基础属性
 */
export interface WebsiteConfiguration {
  id: number;
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  logo: Relation<Media>;
  favicon: Relation<Media>;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    github?: string;
    telegram?: string;
    youtube?: string;
  };
  footerText: string;
  termsAndConditions: string;
  privacyPolicy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建网站配置的输入类型
 */
export type WebsiteConfigurationInput = Omit<
  WebsiteConfiguration,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新网站配置的输入类型
 */
export type WebsiteConfigurationUpdateInput =
  Partial<WebsiteConfigurationInput>;

/**
 * 网站配置响应类型
 */
export type WebsiteConfigurationResponse = StrapiResponse<WebsiteConfiguration>;
