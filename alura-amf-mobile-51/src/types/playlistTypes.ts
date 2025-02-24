import { ContentType } from "./contentTypes";

export type PlaylistsType = {
  id: string;
  studentsId: string;
  name: string;
  description: string;
  slug: string;
  isPublic: boolean;
  contentCount: string;
};

export type CreatePlaylistType = {
  name: string;
  description: string;
  isPublic: boolean;
};

export type PlaylistDetailsType = PlaylistsType & {
  contents: ContentType[];
};

export type PlaylistCardProps = {
  playlist: PlaylistsType;
  refresh: () => Promise<void>;
  hasButtons?: boolean;
  addToPlaylist?: boolean;
  contentId?: string;
};

export type UpdatePlaylistType = CreatePlaylistType & {
  contents: { contentId: string; order: number }[];
};
