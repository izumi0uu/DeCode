import { StrapiAttribute, StrapiMedia } from "./commons";

/**
 * 网站配置属性
 */
export interface WebsiteConfigurationAttributes extends StrapiAttribute {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  favicon: StrapiMedia;
  logo: StrapiMedia;
  metaTitle: string;
  metaDescription: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    discord?: string;
    telegram?: string;
  };
  footerText: string;
  googleAnalyticsId: string;
  enableRegistration: boolean;
}

/**
 * 网站配置类型
 */
export interface WebsiteConfiguration {
  id: number;
  attributes: WebsiteConfigurationAttributes;
}

/**
 * 网站配置响应
 */
export interface WebsiteConfigurationResponse {
  data: WebsiteConfiguration;
  meta: {};
}
