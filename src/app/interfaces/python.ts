export interface FaceDetectionResp {
  success: boolean;
  num_faces: number;
  faces: Array<Array<number>>;
  image: string;
}
export interface UploadImageResp {
  uuid: string;
}