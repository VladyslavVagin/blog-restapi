import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from '../upload.entity';
import { Repository } from 'typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    /** Inject uploadsRepository */
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,

    /** Inject uploadToAwsProvider */
    private readonly uploadToAwsProvider: UploadToAwsProvider,

    /** Inject configService */
    private readonly configService: ConfigService,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    // throw error if unsupported MIME type
    if (
      !['image/gid', 'image/jpeg', 'image/jpg', 'image/png'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Unsupported file type');
    }

    try {
      // Upload file to AWS cloud S3 bucket
      const name = await this.uploadToAwsProvider.fileUpload(file);

      // Genarate a signed URL for the uploaded file to database
      const uploadFile: UploadFile = {
        name,
        path: `https://${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
