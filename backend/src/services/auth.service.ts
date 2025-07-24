import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config /db';
import { User } from '../entities/User';
import { Client } from '../entities/Client';

const userRepo=AppDataSource.getRepository(User);
const clientRepo = AppDataSource.getRepository(Client);

export class AuthService{
    //register
    static async register(data:any){
        const {name,email,password,role}=data;
        const existing=await userRepo.findOneBy({email});

        if(existing) throw new Error('User already exist');

        const hashedPassword=await bcrypt.hash(password,10);
        const user=userRepo.create({name,email,password:hashedPassword,role});
        await userRepo.save(user);
        

        if(role==='Client'){
            const client=clientRepo.create({
                id:user.id,
                user,
                company:'',
                address:'',
                contact_info:'',
            });
            await clientRepo.save(client);
        }
        return user;
    };
    //login
    static async login(email:string,password:string){
        const user=await userRepo.findOneBy({email});
        if(!user) throw new Error("Invalid credentials");

        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch) throw new Error("Invalid credentials");

        const accessToken=jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET!,{expiresIn:'1d'});
        const refreshToken=jwt.sign({id:user.id,role:user.role},process.env.REFRESH_SECRET!,{expiresIn:'7d'});

        return {user,accessToken,refreshToken};
    }
}
