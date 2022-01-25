import { IAWSService } from "../../utils";

export interface AWSProvider extends Pick<IAWSService, 'uploadS3'> {}