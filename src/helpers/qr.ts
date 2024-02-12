import QRCode from 'qrcode'

export const getQrImgString = (text: string) =>
  new Promise<string>((resolve) => {
    QRCode.toDataURL(text, (_err, str) => {
      resolve(str)
    })
  })
