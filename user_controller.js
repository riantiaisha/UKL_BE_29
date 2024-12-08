import { PrismaClient } from "@prisma/client";
import md5 from 'md5'

const prisma = new PrismaClient()

export const getAllUser = async(req, res) => {
    try {
        const result = await prisma.user.findMany()
        res.status(200).json({
            success: true,
            data : result
        })
    } catch (error) { 
        console.log(error);
        res.status(500).json({msg: Message.error})
    }
}
export const getUserById = async(req, res) => {
    try {
        const result = await prisma.user.findUnique({
            where:{
                id_user: req.params.id 
            }
        })
        res.status(200).json({
            success: true,
            data : result
        })
    } catch (error) { 
        console.log(error);
        res.json({
            msg: Message.error
        })
    }
}
export const addUser = async(req, res) => {
    try {
      const { name, username, password, role } = req.body;
      const usernameCheck = await prisma.user.findFirst({
        where: {
          nama_user: name,
          username: username,
          password : md5(password),
          role : role
        },
      });
          if (usernameCheck) {
            res.status(401).json({
              msg: "username sudah ada",
            });
          } else {
            const result = await prisma.user.create({
              data: {
                nama_user: name,
                username: username,
                password: md5(password),
                role: role,
              },
            });
            res.status(201).json({
              success: true,
              message: "Pengguna berhasil ditambah",
              data: result,
            });
          }
        } catch (error) {
          console.log(error);
          res.json({
            msg: error,
          });
        }
      };
export const UpdateUser = async(req, res) => {
    try {
        const {nama, username, password,role} = req.body
        const result = await prisma.user.update({
            where:{
                id_user : req.params.id
            },
            data:{
                nama: nama, 
                username: username,
                password : md5(password),
                role: role
            }
        })
        res.status(200).json({
            success: true,
            data : result
        })
    } catch (error) { 
        console.log(error);
        res.json({
            msg: Message.error
        })
    }
}
export const DelateUser = async(req, res) => {
    try {
        const result = await prisma.user.delate({
            where:{
                success:req.params.id
            }
        })
        res.status(200).json({
            success: true,
            data : result
        })
    } catch (error) { 
        console.log(error);
        res.json({
            msg: Message.error
        })
    }
}