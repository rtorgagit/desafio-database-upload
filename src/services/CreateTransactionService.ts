import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const createCategoryService = new CreateCategoryService();

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total - value < 0) {
      throw new AppError('You do not have enough balance', 400);
    }

    const categoryBD = await createCategoryService.execute({
      category,
    });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryBD.id,
      category: categoryBD,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
