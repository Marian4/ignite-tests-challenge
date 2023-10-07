import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let usersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let user: User;
let generalStatement;

describe("Create Statement", () => {
  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)

    user = await usersRepository.create({ name: "Mariana", email: "mariana@email.com", password: "maripass"})
    generalStatement = { user_id: user.id, amount: 100, description: 'testing' }
  })

  it("Should be able to create a new deposit statement", async () => {
    const { balance: initialBalance } = await statementsRepository.getUserBalance({user_id: user.id})
    const statement = await createStatementUseCase.execute({...generalStatement, type: OperationType.DEPOSIT})
    const { balance: finalBalance } = await statementsRepository.getUserBalance({user_id: user.id})

    expect(finalBalance).toEqual(initialBalance + statement.amount)
  })

  it("Should not be able to create a new withdraw statement if the user does not have enough funds", async () => {
    const { balance: userBalance } = await statementsRepository.getUserBalance({user_id: user.id})

    expect(
      createStatementUseCase.execute({
        ...generalStatement,
        amount: userBalance + 1,
        type: OperationType.WITHDRAW})
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

  it("Should be able to create a new withdraw statement", async () => {
    const { balance: initialBalance } = await statementsRepository.getUserBalance({user_id: user.id})
    const statement = await createStatementUseCase.execute({...generalStatement, type: OperationType.WITHDRAW})
    const { balance: finalBalance } = await statementsRepository.getUserBalance({user_id: user.id})

    expect(finalBalance).toEqual(initialBalance - statement.amount)
  })

  it("Should not be able to create a statement if the user does not exist", async () => {
    expect(
      createStatementUseCase.execute({...generalStatement, user_id: 'randomId', type: OperationType.DEPOSIT})
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

})
