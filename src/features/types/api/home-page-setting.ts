// src/types/api/home-page-setting.ts
import { Media, Relation, RelationArray, StrapiResponse } from "./common";
import { Course } from "./course";

/**
 * 首页设置基础属性
 */
export interface HomePageSetting {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: Relation<Media>;
  featuredCourses: RelationArray<Course>;
  popularCourses: RelationArray<Course>;
  bannerImages: RelationArray<Media>;
  bannerTitle: string;
  bannerDescription: string;
  bannerButtonText: string;
  bannerButtonUrl: string;
  featuredSectionTitle: string;
  featuredSectionDescription: string;
  popularSectionTitle: string;
  popularSectionDescription: string;
  testimonials: {
    name: string;
    avatar?: Relation<Media>;
    testimonial: string;
    role: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建首页设置的输入类型
 */
export type HomePageSettingInput = Omit<
  HomePageSetting,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * 更新首页设置的输入类型
 */
export type HomePageSettingUpdateInput = Partial<HomePageSettingInput>;

/**
 * 首页设置响应类型
 */
export type HomePageSettingResponse = StrapiResponse<HomePageSetting>;
