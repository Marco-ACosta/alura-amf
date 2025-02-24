export type ContentType = {
  id: string;
  type: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  thumbnail: string;
  thumbnailFormat: string;
  duration: number;
  order?: number;
};

export type ContentDetailsType = ContentType & {
  description: string;
  path: string;
};

export type ContentCardType = {
  content: ContentType;
  isInPlaylist?: boolean;
  playlistId?: string;
  studentId?: string;
  onLongPress?: () => void;
};
