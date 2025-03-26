import { StrapiAttribute, StrapiRelationship } from "./commons";
import { UserAttributes } from "./user";
import { ThematicQueryAttributes } from "./thematic-query";

/**
 * 主题回复属性
 */
export interface ThematicResponseAttributes extends StrapiAttribute {
  content: string;
  isAccepted: boolean;
  user: StrapiRelationship<UserAttributes>;
  thematicQuery: StrapiRelationship<ThematicQueryAttributes>;
}

/**
 * 主题回复类型
 */
export interface ThematicResponse {
  id: number;
  attributes: ThematicResponseAttributes;
}

/**
 * 主题回复列表响应
 */
export interface ThematicResponseListResponse {
  data: ThematicResponse[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
