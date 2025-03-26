import { StrapiAttribute, StrapiRelationship, StrapiMedia } from "./commons";
import { CourseAttributes } from "./course";

/**
 * 首页设置属性
 */
export interface HomePageSettingAttributes extends StrapiAttribute {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: StrapiMedia;
  featuredCourses: StrapiRelationship<CourseAttributes>;
  aboutSection: {
    title: string;
    content: string;
    image: StrapiMedia;
  };
  ctaSection: {
    title: string;
    content: string;
    buttonText: string;
    buttonUrl: string;
  };
}

/**
 * 首页设置类型
 */
export interface HomePageSetting {
  id: number;
  attributes: HomePageSettingAttributes;
}

/**
 * 首页设置响应
 */
export interface HomePageSettingResponse {
  data: HomePageSetting;
  meta: {};
}
