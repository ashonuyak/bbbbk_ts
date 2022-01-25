import { Container } from "inversify";
import { AWSService, IAWSService, TYPES } from ".";

const awsContainer = new Container()

awsContainer.bind<IAWSService>(TYPES.AWSService).to(AWSService).inSingletonScope()

export { awsContainer }
