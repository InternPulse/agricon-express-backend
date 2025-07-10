import { cloudinary } from "../config/config.cloudinary";
import { BadRequestError } from "../errors/errors";

export const uploadImageToCloudinary = async(buffer: Buffer, folder: string='facilities'): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: folder,
          transformation: [
            {width: 800, height: 600, crop: 'limit'},
            { quality: 'auto'}
          ]
        },
        (error, result) => {
          if(error){
            reject(new BadRequestError({
              message: 'Failed to upload image to cloudinary',
              from: 'uploadImageToCloudinary',
              cause: error
            }))
          }else{
            resolve(result!.secure_url)
          }
        }
      ).end(buffer)
    })
  } catch (error) {
    throw new BadRequestError({
      message: 'Error uploading image',
      from: 'uploadImageToCloudinary()',
      cause: error
    })
  }
};


export const deleteImageFromCloudinary = async(imageUrl: string): Promise<void>=>{
  try {
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    const result = await cloudinary.uploader.destroy(publicId);
    if(result.result !== 'ok'){
       throw new BadRequestError({
        message: 'Error deleting image from cloudinary',
        from: 'deleteImageFromCloudinary()',
        cause: result.result
      });
    }
  } catch (error) {
    throw new BadRequestError({
        message: 'Error deleting image from cloudinary',
        from: 'deleteImageFromCloudinary()',
        cause: error
      });
  }
}