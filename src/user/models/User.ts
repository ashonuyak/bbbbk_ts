import { UserDto } from "../interfaces"

export class User {
  id: number
  password: string
  fname: string
  lname: string
  id_category: number
  email: string
  country: string
  city: string
  category_name: string
  id_info: number
  rate: string
  photo: string
  stack: string

  constructor(dbRes: UserDto.WholeUser) {
    this.id = dbRes.id
    this.password = dbRes.password
    this.fname = dbRes.fname
    this.lname = dbRes.lname
    this.id_category = dbRes.id_category;
    this.email = dbRes.email
    this.country = dbRes.country
    this.city = dbRes.city
    this.category_name = dbRes.category_name
    this.id_info = dbRes.id_info
    this.rate = dbRes.rate
    this.photo = dbRes.photo
    this.stack = dbRes.stack
  }

  getInfo() {
    const responseData = {
      id: this.id,
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      id_info: this.id_info,
      photo: this.photo
    }

    return responseData
  }

  getFullInfo() {
    const responseData = {
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      id_category: this.id_category,
      country: this.country,
      city: this.city,
      stack: this.stack,
      rate: this.rate,
      photo: this.photo
    }
    return responseData
  }

  getAllUsers() {
    const responseData = {
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      photo: this.photo,
      country: this.country,
      city: this.city,
      rate: this.rate,
      stack: this.stack,
      category_name: this.category_name
    }
    return responseData
  }

  getEmail() {
    const responseData = {
      email: this.email
    }
    return responseData
  }
  getIdInfo() {
    const responseData = {
      id_info: this.id_info
    }
    return responseData
  }
}
