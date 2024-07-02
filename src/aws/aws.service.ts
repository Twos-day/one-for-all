import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { IMAGE_EXTNAME_LIST } from 'src/image/const/extname.const';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AwsService {
  s3Client: S3Client;

  constructor(private configService: ConfigService) {
    // AWS S3 클라이언트 초기화. 환경 설정 정보를 사용하여 AWS 리전, Access Key, Secret Key를 설정.

    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'), // AWS Region
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'), // Access Key
        secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'), // Secret Key
      },
    });
  }

  async imageUploadToS3(
    file: Express.Multer.File, // 업로드할 파일
  ) {
    const id = uuid();
    const ext = extname(file.originalname); //ㅍ일 확장자 추출
    const fileName = id + ext; // 파일 이름 생성
    // AWS S3에 이미지 업로드 명령을 생성합니다. 파일 이름, 파일 버퍼, 파일 접근 권한, 파일 타입 등을 설정합니다.
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'), // S3 버킷 이름
      Key: fileName, // 업로드될 파일의 이름: 파일 경로를 다르게 할때는 폴더/파일명+확장자 ex) posts/thumbnail.jpg
      Body: file.buffer, // 업로드할 파일
      // ACL: 'public-read', // 파일 접근 권한
      ContentType: file.mimetype, // 파일 타입
    });

    // 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
    await this.s3Client.send(command);

    Logger.log(`AWS S3 이미지 업로드 성공, 파일명: ${fileName}`);

    // 업로드된 이미지의 URL을 반환합니다.
    return { path: fileName };
  }

  // https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_Scenario_PresignedUrl_section.html
  async generatePresignedUrl(
    projectName: string,
    userId: number,
    fileName: string,
  ) {
    const id = uuid();
    const ext = extname(fileName);

    if (!IMAGE_EXTNAME_LIST.includes(ext)) {
      throw new BadRequestException('지원하지 않는 파일 형식입니다.');
    }

    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: [projectName, userId.toString(), id + ext].join('/'),
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }
}
