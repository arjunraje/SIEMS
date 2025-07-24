import { Request,Response } from "express"
import { ClientService } from "../services/client.service";
import { AppDataSource } from "../config /db";
import { Invoice } from "../entities/Invoice";
import { Client } from "../entities/Client";
import { User } from "../entities/User";

// show inoive for client

export const getAllClients=async(req:Request,res:Response)=>{
    try{
        const clients=await AppDataSource.getRepository(Client).find({
            relations:['user'],
        });

        const response=clients.map((client)=>({
            id:client.id,
            name:client.user.name,
        }));
        res.json(response)
    }catch(err){
        res.status(500).json({message:'Faild to fetch user data!'});
    }
}
export const getClientInvoices=async(req:Request,res:Response)=>{
    const clientId=req.user!.id;
    
    const invoices= await AppDataSource.getRepository(Invoice).find({
        where:{client:{id:clientId}},
        relations:{items:true,client:{user:true}}
    });
    res.json(invoices);
}

//show profile
export const getClientProfile=async(req:Request,res:Response)=>{
    const profile=await AppDataSource.getRepository(Client).findOne({
        where:{id:req.user!.id},
        relations:{user:true}
    });
    if(!profile) return res.status(404).json({message:'Client not found'});

    res.json(profile);
};

export const updateClientProfile = async (req: Request, res: Response) => {
  const { company, address, contact_info } = req.body;

  const clientRepo = AppDataSource.getRepository(Client);
  const client = await clientRepo.findOneBy({ id: req.user!.id });

  if (!client) return res.status(404).json({ message: 'Client not found' });

  client.company = company ?? client.company;
  client.address = address ?? client.address;
  client.contact_info = contact_info ?? client.contact_info;

  await clientRepo.save(client);

  res.json({ message: 'Profile updated', client });
};

