import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase
let user: User;

describe("Create User", () => {
  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)

    user = await usersRepository.create({ name: "Mariana", email: "mariana@email.com", password: "maripass"})
  })
  it("Should be able to find an user and show your data by id", async () => {
    const userProfile = await showUserProfileUseCase.execute(user.id)

    expect(userProfile).toHaveProperty("email", user.email)
    expect(userProfile).toHaveProperty("name", user.name)
  })

  it("Should not be able to find an user that does not exist", async () => {
    expect(
      showUserProfileUseCase.execute("radomId")
    ).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
