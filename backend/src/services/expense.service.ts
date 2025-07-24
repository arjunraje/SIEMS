import { Between, ILike, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../config /db";
import { Expense } from "../entities/Expense";
import { User } from "../entities/User";

interface CreateExpenseDTO{
    amount:number;
    category:string;
    note?:string;
    date:Date;
    receipt_url?:string;
    user_id:number;
}

export const ExpenseService={
    async createExpense(data:CreateExpenseDTO):Promise<Expense>{
        const expenseRepo=AppDataSource.getRepository(Expense);
        const userRepo=AppDataSource.getRepository(User);

        const user=await userRepo.findOneBy({id:data.user_id});
        if(!user) throw new Error('User not found');

        const expense=expenseRepo.create({
            amount:data.amount,
            category:data.category,
            note:data.note,
            date:data.date,
            receipt_url:data.receipt_url|| null,
            created_by:user,
        });
        return await expenseRepo.save(expense);
    }
};

export const getExpenses = async (filters: any) => {
    const repo = AppDataSource.getRepository(Expense);
    const where: any = {};

    if (filters.category) {
        where.category = ILike(`%${filters.category}%`);
    }

    if (filters.month) {
        const [year, month] = filters.month.split("-");
        const start = new Date(`${year}-${month}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        where.date = Between(start, end);
    }

    if (filters.min && filters.max) {
        where.amount = Between(parseFloat(filters.min), parseFloat(filters.max));
    } else if (filters.min) {
        where.amount = MoreThanOrEqual(parseFloat(filters.min));
    } else if (filters.max) {
        where.amount = LessThanOrEqual(parseFloat(filters.max));
    }

    return await repo.find({
        where,
        relations: ["created_by"],
        order: { created_at: "DESC" },
    });
};

export const getExpenseById=async(id:number) =>{
    const invoice= await AppDataSource.getRepository(Expense).findOne({
        where:{id},
    });

    if(!invoice){
        throw new Error("Invoice not found");
    }
    return invoice;
};
//edite expense
export const updateExpense=async (id:number,data:any,user: Pick<User, "id" | "role">)=>{
    const repo=AppDataSource.getRepository(Expense);
    const expense= await repo.findOne({
        where:{id},
        relations:['created_by'],
    });

    if(!expense) throw new Error("Expense not fount");

    const isAdmin=user.role==='Admin';
    const isOwner=expense.created_by.id===user.id;

    if(!isAdmin && !isOwner){
        throw new Error("Not authorized to update the expense");
    }
    Object.assign(expense,data);
    return await repo.save(expense);
};

//delete expense
export const deleteExpense=async (id:number,user: Pick<User, "id" | "role">)=>{
    const repo =AppDataSource.getRepository(Expense);
    const expense=await repo.findOne({
        where:{id},
        relations:['created_by'],
    });

    if(!expense){
        throw new Error('Expense is not found');
    }

    const isAdmin=user.role==='Admin';
    const isOwner=expense.created_by.id===user.id;

    if(!isAdmin && !isOwner){
        throw new Error('Not authorized to delete the expense');
    }
    await repo.remove(expense);
}