import { IUserDao } from "../../user/interfaces";

export interface UserDaoProvider extends Pick<IUserDao, 'get' | 'checkPassword'> {}