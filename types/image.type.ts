export interface ImageKitResponse {
  url: string;
  fileId: string;
  thumbnailUrl?: string;
  [key: string]: any;
}

export interface AvatarUpdatePayload {
  file_id: string;
  url: string;
}