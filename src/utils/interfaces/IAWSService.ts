export interface IAWSService {
  uploadS3(base64: string, folder: string, subfolder: string): Promise<string>
}
