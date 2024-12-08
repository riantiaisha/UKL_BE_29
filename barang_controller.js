import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient()

export const getAllBarang = async(req, res) =>{
    try {
        const result = await prisma.barang.findMany()
        res.status(200).json({
            status: "success",
            data : result
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: MessageChannel.error
        })   
    }
}
export const getBarangById = async (req, res) => {
    try {
      const id_barang = Number(req.params.id);
  
      if (isNaN(id_barang)) {
        return res.status(400).json({
          success: false,
          message: "Invalid inventory ID. It must be a number.",
        });
      }

      const result = await prisma.barang.findUnique({
        where: { id_barang }, 
      });
  
      if (!result) {
        return res.status(404).json({
          success: false,
          message: `Barang with inventoryID ${id_barang} not found.`,
        });
      }
  
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error fetching barang by ID:", error.message);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching barang.",
      });
    }
  };
  
export const addBarang = async(req, res) =>{
    try {
        const {nama_barang, kategori, lokasi, quantity} = req.body
        const result = await prisma.barang.create({
            data:{
                nama_barang : nama_barang,
                category: kategori,
                location : lokasi,
                quantity : quantity
            }
        })
        res.status(200).json({
            status: "success",
            message : "Barang berhasil ditambahkan",
            data : result
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: MessageChannel.error
        })   
    }
}
export const UpdateBarang = async (req, res) => {
    try {
        const { nama_barang, kategori, lokasi, quantity } = req.body;
        const id_barang = Number(req.params.id);

        if (isNaN(id_barang)) {
            return res.status(400).json({
                status: "error",
                msg: "ID barang harus berupa angka!"
            });
        }

        if (!nama_barang && !kategori && !lokasi && !quantity) {
            return res.status(400).json({
                status: "error",
                msg: "Semua data harus diisi"
            });
        }
        const result = await prisma.barang.update({
            where: {
                id_barang: id_barang
            },
            data: {
                nama_barang: nama_barang,
                category: kategori,
                location: lokasi,
                quantity: quantity
            }
        });

        res.status(200).json({
            status: "success",
            message: "Barang berhasil diubah",
            data: result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            msg: error.message
        });
    }
};


export const DelateBarang= async(req, res) =>{
    try {
        const result = await prisma.barang.delete({
            where:{
                id_barang:Number(req.params.id)
            },
        })
        res.status(200).json({
            Status:"data berhasil di hapus", 
            data:result
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: MessageChannel.error
        })   
    }
}