import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let usersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase
let user: User
let statement: Statement

describe("Get Statement Operation", () => {
  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)

    user = await usersRepository.create({ name: "Mariana", email: "mariana@email.com", password: "maripass"})
    statement = await statementsRepository.create({
      user_id: user.id,
      amount: 100,
      type: OperationType.DEPOSIT,
      description: "test"
    })
  })

  it("Should be able to get a statement operation", async () => {
    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    })

    expect(statementOperation).toHaveProperty("id", statement.id)
    expect(statementOperation).toHaveProperty("amount", statement.amount)
  })

  it("Should not be able to get a statement operation if the user does not exist", async () => {
    expect(
      getStatementOperationUseCase.execute({
        user_id: 'randomId',
        statement_id: statement.id
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("Should not be able to get a statement operation if the statement does not exist", async () => {
    expect(
      getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: 'randomId'
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
