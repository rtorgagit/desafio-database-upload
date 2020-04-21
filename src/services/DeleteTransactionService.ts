import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!isUuid(id)) {
      throw new AppError('Transaction ID is invalid.', 400);
    }

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found.', 400);
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
