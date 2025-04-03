import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs';
import path from 'path';

export default class ManlessController {

  public async index({request, response}: HttpContextContract) {

    console.log(request.url());
    
    const data = {
      "Status": 1,
      "Date": new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      "Message": "Akses Diterima",
      "CardNo": "240328232604664",
      "Direction": 1,
      "Description": "BARRIER GATE RODA 4"
    }

    return response.status(200).json(data)
  }

  public async detectPlate({ request, response }: HttpContextContract) {
    try {
      const imageFile = request.file('file')
      if (!imageFile) {
        return response.status(400).json({
          error: 'No image file provided'
        })
      }

      // Create form data for ALPR service
      const formData = new FormData()
      formData.append('file', imageFile.tmpPath, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
      })

      // Call external ALPR service
      const alprResponse = await axios.post(
        process.env.ALPR_SERVICE_URL || 'http://localhost:5000/detect-plate',
        formData,
        {
          headers: {
            ...formData.getHeaders()
          }
        }
      )

      const predictions = alprResponse.data
      if (predictions && predictions.length > 0) {
        const bestPrediction = predictions[0]
        const { plate_number, confidence, bbox } = bestPrediction

        if (confidence > 90) {
          const now = new Date()
          const transactionId = `TRX${Date.now()}`
          
          await Database.table('transaksi_parkir').insert({
            id: transactionId,
            no_pol: plate_number,
            id_kendaraan: 'A',
            status: 1,
            id_pintu_masuk: '01', 
            waktu_masuk: now,
            status_transaksi: '1',
            tanggal: now,
            sinkron: 0,
            upload: 0,
            manual: 0
          })

          try {
            await axios.post(`${process.env.GATE_CONTROL_URL || 'http://localhost:8080'}/open`, {
              gateId: '01',
              transactionId
            })
          } catch (gateError) {
            console.error('Gate control error:', gateError)
          }

          return response.status(200).json({
            confidence,
            plate_number,
            bbox,
            gateOpened: true
          })
        }
      }

      return response.status(200).json({
        confidence: 0,
        plate_number: '',
        bbox: null,
        gateOpened: false
      })

    } catch (error) {
      console.error('ALPR Error:', error)
      return response.status(500).json({
        error: 'Failed to process license plate'
      })
    }
  }

  public async button({request, response}: HttpContextContract) {
    const urlParams = request.params().params.split('&')

    const params = Object.fromEntries(urlParams.map((item: string) => item.split('=')))
    
    console.log(params)
    // return response.status(200).json(params)
    // const termno = urlParams.get('termno');
    // const cardno = urlParams.get('cardno');
    // const description = urlParams.get('description');
    // console.log("url", request.url());
    
    // console.log(termno, direction, qrcode)

    const data = {
      "Status": 1,
      "Date": new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()).replace(/\//g, '-').replace(/\./g, ':').replace(/,/g, ''),
      "Message": "Akses Diterima",
      "CardNo": params.qrcode,
      "Direction": params.direction,
      "Description": "BARRIER GATE RODA 4"
    }

    return response.status(200).json(data)
  }

  public async card({request, response}: HttpContextContract) {
    const urlParams = request.params().params.split('&')

    const params = Object.fromEntries(urlParams.map((item: string) => item.split('=')))
    console.log(params)

    const data = {
      "Status": 1,
      "Date": new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()).replace(/\//g, '-').replace(/\./g, ':').replace(/,/g, ''),
      "Message": "Akses Diterima",
      "CardNo": params.cardno,
      "Direction": params.direction,
      "Description": "BARRIER GATE RODA 4"
    }

    return response.status(200).json(data)
  }

  // public async storeTransaction({ request, response }: HttpContextContract) {
  //   try {
  //     const data = request.body();

  //     await Database.table('gate_transactions').insert({
  //       plate_number: data.plate_number,
  //       plate_image: data.plate_image,
  //       driver_image: data.driver_image,
  //       timestamp: data.timestamp,
  //       gate_status: data.gate_status,
  //       location: data.location,
  //       confidence: data.confidence,
  //       processing_time: data.processing_time,
  //       operator: data.operator,
  //     });

  //     return response.status(200).json({ message: 'Data saved successfully' });
  //   } catch (error) {
  //     console.error('Error saving entry data:', error);
  //     return response.status(500).json({ message: 'Failed to save data', error });
  //   }
  // }

  public async storeTransaction({ request, response }: HttpContextContract) {
    try {
      const data = request.body();
      console.log("🚀 ~ ManlessController ~ storeTransaction ~ data:", data)

      const platNumber = JSON.parse(data.detected_plates).map((item: any) => item.plate_number).join(', ');
      console.log("🚀 ~ ManlessController ~ storeTransaction ~ platNumber:", platNumber)
      const plateImageFile = request.file('plate_image');
      const driverImageFile = request.file('driver_image');
      const id = `${Date.now()}${platNumber.split(',')[0]}`;


      let plateImagePath: string | null = null;
      let driverImagePath: string | null = null;

      if (plateImageFile) {
        const plateImageName = `${id}.jpg`;
        plateImagePath = `${plateImageName}`;
        await plateImageFile.moveToDisk(path.join('images', 'plate'), {
          name: plateImageName,
          overwrite: true,
        });
      }

      if (driverImageFile) {
        const driverImageName = `${id}.jpg`;
        driverImagePath = `${driverImageName}`;
        await driverImageFile.moveToDisk(path.join('images','driver'), {
          name: driverImageName,
          overwrite: true,
        });
      }

      

      await Database.table('gate_transactions').insert({
        id,
        plate_number: platNumber,
        plate_image: plateImagePath,
        driver_image: driverImagePath,
        entry_time: new Date(),
        exit_time:  new Date(),
        parking_fee: 0,
        gate_status: data.gate_status,
        location: data.location,
        processing_time: data.processing_time,
        operator: data.operator,
      });

      return response.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error saving entry data:', error);
      return response.status(500).json({ message: 'Failed to save data', error });
    }
  }
}