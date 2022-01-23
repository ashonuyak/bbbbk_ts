import config from 'config'
import { fromBuffer } from 'file-type'

import AWS, { ConfigurationOptions } from 'aws-sdk'

export class AWSS3 {
  private readonly s3: AWS.S3
  private readonly options: ConfigurationOptions
  constructor() {
    this.options = {
      accessKeyId: config.get('aws.accessKeyId'),
      secretAccessKey: config.get('aws.secretAccessKey')
    }
    AWS.config.update(this.options)
    this.s3 =  new AWS.S3()
  }

  async uploadS3(base64: string, folder: string, subfolder: string): Promise<string> {
    const base64Data = Buffer.from(
      Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    )
    const obj = await fromBuffer(base64Data)

    const timestamp = +new Date()
    const filename = `${folder}/${subfolder ? `${subfolder}/` : ''}${timestamp}.${obj?.ext}`

    if (subfolder) {
      const params = {
        Bucket: config.get('aws.bucketName') as string,
        Prefix: `${folder}/${subfolder}`
      }

      this.s3
        .listObjects(params)
        .promise()
        .then(async (data) => {
          const listedObjects = data.Contents

          const deleteParams = {
            Bucket: config.get('aws.bucketName') as string,
            Delete: { Objects: [] } as { Objects: any[] }
          }

          listedObjects?.forEach(({ Key }) => {
            if(Key) deleteParams.Delete.Objects.push({ Key })
          })

          if (deleteParams.Delete.Objects.length > 0) {
            await this.s3.deleteObjects(deleteParams).promise()
          }
        })
    }

    return new Promise((resolve, reject) => {
      this.s3.upload(
        {
          Bucket: config.get('aws.bucketName'),
          Key: filename,
          Body: base64Data,
          ContentEncoding: 'base64',
          ContentType: `image/${obj?.ext}`,
          ACL: 'public-read',
          // Prefix: `${folder}/${subfolder}`
        },
        (err, data) => {
          if (err) {
            return reject(err)
          }
          return resolve(data.Location)
        }
      )
    })
  }
}
