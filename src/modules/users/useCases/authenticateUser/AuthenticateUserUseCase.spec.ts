import dotenv from 'dotenv'
dotenv.config()
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let user: User;

describe("Create User", () => {
  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)

    user = await createUserUseCase.execute({ name: "Mariana", email: "mariana@email.com", password: "maripass"})
  })

  it("Should be able to authenticate an user", async () => {
    const auth = await authenticateUserUseCase.execute({email: user.email, password: "maripass"})

    expect(auth).toHaveProperty("token")
  })

  it("Should not be able to authenticate an user if it had passed a wrong password", async () => {
    expect(
      authenticateUserUseCase.execute({email: user.email, password: "wrongpass"})
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should not be able to authenticate an user if it had passed an unknown email", async () => {
    expect(
      authenticateUserUseCase.execute({email: "random_email@email.com", password: user.password})
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
