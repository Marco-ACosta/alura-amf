export type ContentType = {
  id: string;
  type: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  thumbnail: string;
  thumbnailFormat: string;
  duration: number;
};

export type ContentDetailsType = ContentType & {
  description: string;
  path: string;
};
