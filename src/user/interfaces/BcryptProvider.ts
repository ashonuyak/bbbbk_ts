import { IBcryptService } from "../../bcrypt"

export interface BcryptProvider extends Pick<IBcryptService, 'hash' | 'compare'> {}