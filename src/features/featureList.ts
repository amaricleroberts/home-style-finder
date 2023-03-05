export type HomePart = {
  id: string;
  name: string;
  features: HomeFeature[];
};

export type HomeFeature = {
  id: string;
  title: string;
  fullTitle: string;
  description?: string;
  image?: string;
  parentId?: string;
};

export type HomeStyle = {
  id: string;
  display_name: string;
};

export interface RawStyleMatch {
  key: string;
  score: number;
};
