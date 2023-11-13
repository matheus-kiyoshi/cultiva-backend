import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
const serviceAccount = require("../../../../serviceAccountKey.json");

const BUCKET = 'cultiva-e5593.appspot.com'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET,
})

const bucket = admin.storage().bucket();

export const uploadImages = async (
  req: Request,
) => {
  if (!req.files || req.files.length === 0) return;

  const uploadedFiles: string[] = [];

  async function uploadSingleFile(image: any) {
    const fileName = Date.now() + "." + image.originalname.split(".")[1]

    const file = bucket.file(fileName)

    const stream = file.createWriteStream({
      metadata: {
        contentType: image.mimetype,
      },
    })

    return new Promise<void>((resolve, reject) => {
      stream.on("error", (err: any) => {
        console.log(err)
        reject(err)
      })

      stream.on("finish", async () => {
        await file.makePublic()

        const firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${fileName}`

        uploadedFiles.push(firebaseUrl)

        resolve();  
      })

      stream.end(image.buffer)
    })
  }

  const images = req.files as Express.Multer.File[];
  
  try {
    await Promise.all(images.map(async (image) => {
      await uploadSingleFile(image);
    }));
  
    return uploadedFiles
  } catch (error) {
    return error
  }
}