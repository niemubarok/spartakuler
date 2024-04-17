import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
