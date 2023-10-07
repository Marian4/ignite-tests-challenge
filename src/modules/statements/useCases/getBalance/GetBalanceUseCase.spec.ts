import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let usersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase
let user: User

describe("Get Balance", () => {
  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)

    user = await usersRepository.create({ name: "Mariana", email: "mariana@email.com", password: "maripass"})
  })

  it("Should be able to get the user balance", async () => {
    const deposit = await statementsRepository.create({
      user_id: user.id,
      amount: 100,
      type: OperationType.DEPOSIT,
      description: "test"
    })

    const { balance } = await getBalanceUseCase.execute({ user_id: user.id })

    expect(balance).toEqual(deposit.amount)
  })

  it("Should not be able to get the user balance if the user does not exist", async () => {
    expect(
      getBalanceUseCase.execute({ user_id: 'randomId'})
    ).rejects.toBeInstanceOf(GetBalanceError)
  })
})
