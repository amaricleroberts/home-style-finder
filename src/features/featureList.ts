export type HomePart = {
  id: string;
  name: string;
  features: HomeFeature[];
};

export type HomeFeature = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  parentId?: string;
};
