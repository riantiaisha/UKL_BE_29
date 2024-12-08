import md5 from 'md5'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const secretKey = 'moklet'

export const authenticate = async (req, res) => {
    const {username, password} = req.body
    try {
        const userCek = await prisma.user.findFirst({
            where:{
                username: username,
                password:md5(password)
            }
        })
        if(userCek){
            const payload = JSON.stringify(userCek)
            const token = jwt.sign(payload, secretKey)
            res.status(200).json({
                succes: true,
                logged: true,
                message: 'login succes',
                token: token,
                data: userCek
            })
        }else{
            res.status(404).json({
                succes: false,
                logged: false,
                message: 'username or password invalid'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

export const authorize = async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"]; // Ambil token dari header
      console.log("cek authHeader " + authHeader);
  
      if (authHeader) {
        const token = authHeader.split(" ")[1]; // Ekstrak token dari header 'Bearer <token>'
        try {
          const verifiedUser = jwt.verify(token, secretKey); // Verifikasi token
  
          if (!verifiedUser) {
            // Token kadaluarsa atau tidak valid
            res.status(401).json({
              success: false,
              auth: false,
              message: "Token tidak valid atau sudah kadaluarsa.",
            });
          } else {
            req.user = verifiedUser; // Simpan data pengguna di request
            next(); // Lanjutkan ke endpoint berikutnya
          }
        } catch (error) {
          // Token salah atau error dalam proses verifikasi
          if (error.name === "TokenExpiredError") {
            res.status(401).json({
              success: false,
              auth: false,
              message: "Token sudah kadaluarsa. Silakan login ulang.",
            });
          } else if (error.name === "JsonWebTokenError") {
            res.status(401).json({
              success: false,
              auth: false,
              message: "Token tidak valid.",
            });
          } else {
            // Error lain saat memproses token
            res.status(500).json({
              success: false,
              message: "Terjadi kesalahan saat memproses token.",
              error: error.message,
            });
          }
        }
      } else {
        // Jika tidak ada header authorization
        res.status(403).json({
          success: false,
          message: "Akses ditolak. Token tidak ditemukan.",
        });
      }
    } catch (error) {
      // Error lain di server
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server.",
        error: error.message,
       });
    }
  };