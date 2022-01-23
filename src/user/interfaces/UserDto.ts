export interface WholeUser {
  id: number,
  password: string,
  fname: string,
  lname: string,
  id_category: number,
  email: string,
  country: string,
  city: string,
  category_name: string,
  id_info: number,
  rate: string,
  photo: string,
  stack: string
}

export interface GetUser {
  id: number,
  password: string,
  fname: string,
  lname: string,
  email: string,
  id_info: number,
  photo: string
}

export interface UserCreate extends Pick<WholeUser, 'fname' | 'lname' | 'email' | 'password'> {}

export interface Tokens {
  accessToken:{
    id: number,
    expiresIn: number,
  },
  refreshToken:{
    email:string,
    expiresIn: number,
  }
}

export interface GetAllUsers extends Omit<UserCreate, 'password'> {
  photo: string,
  country: string,
  city: string,
  rate: string,
  category_name: string
}

export interface UserUpdate extends Pick<WholeUser, 'fname' | 'lname' | 'email' | 'password' | 'id'> {}

export interface InsertInfo extends Omit<WholeUser, 'fname' | 'lname' | 'email' | 'password' | 'category_name' | 'photo' | 'search'> {}

export interface SearchUsers extends Pick<WholeUser, 'country' | 'city' | 'id_category' | 'stack'> {
  search: string
}

export interface SearchUsersResponse extends Pick<WholeUser, 'fname' | 'lname' | 'photo' | 'country' | 'city' | 'stack' | 'rate' | 'email'> {}

export interface UpdateInfo extends Pick<WholeUser, 'country' | 'city' | 'rate' | 'stack' | 'id_category' | 'id_info'> {}

export interface InsertInfoResponse extends Omit<UpdateInfo, 'id_info'> {
  id: number
}

export interface UserCheckPassword extends Omit<WholeUser, 'id' | 'id_category' | 'id_info' | 'search'> {}
