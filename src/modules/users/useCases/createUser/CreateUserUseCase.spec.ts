import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let user: User;

describe("Create User", () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })
  it("Should be able to create a new user", async () => {
    user = await createUserUseCase.execute({ name: "Mariana", email: "mariana@email.com", password: "maripass"})

    expect(user).toHaveProperty("id")
  })

  it("Should not be able to create an user that already exists", async () => {
    expect(
      createUserUseCase.execute({
        name: "João",
        email: user.email,
        password: "joaopass"
      }))
      .rejects.toBeInstanceOf(CreateUserError)
  })
})
