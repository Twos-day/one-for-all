import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TwosdayReferenceModel } from './entities/reference.entity';
import { google } from 'googleapis';
import * as cheerio from 'cheerio';
import { Info } from './type/info.type';
import { Repository } from 'typeorm';

export const youtubeService = google.youtube('v3');

@Injectable()
export class TwosdayReferenceService {
  constructor(
    @InjectRepository(TwosdayReferenceModel)
    private readonly referenceRepository: Repository<TwosdayReferenceModel>,
  ) {}

  extractYoutubeVId(url: string) {
    const videoId = url
      .match(/(?:\?v=|&v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
      .trim();
    return videoId;
  }

  async getYoutubeInfoByVId(videoId: string) {
    const response = await youtubeService.videos.list({
      part: ['id', 'snippet', 'statistics'],
      id: [videoId],
      key: process.env.GOOGLE_API_KEY,
    });

    const item = response.data.items?.[0];

    if (!item) {
      throw new NotFoundException(
        `${videoId} 해당하는 영상을 찾을 수 없습니다.`,
      );
    }

    return {
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title: item.snippet?.title || '',
      description: item.snippet?.description.replaceAll('\n', ' '),
      thumbnail: item.snippet?.thumbnails?.medium?.url || '',
    };
  }

  async crawlingUrl(url: string) {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);

    const info: Info = {
      url,
      title: $('title').text() || '',
      description: $('meta[name="description"]').attr('content') || '',
      thumbnail: $('meta[property="og:image"]').attr('content') || '',
    };

    return info;
  }

  async createReference(info: Info) {
    const reference = this.referenceRepository.create(info);
    return this.referenceRepository.save(reference);
  }

  getReferences(page: number, size: number) {
    try {
      return this.referenceRepository.findAndCount({
        select: [
          'id',
          'title',
          'description',
          'thumbnail',
          'url',
          'createdAt',
          'updatedAt',
        ],
        // 페이지는 1보다 작을 수 없음
        skip: page < 2 ? 0 : (page - 1) * size,
        take: size,
        order: { updatedAt: 'DESC' },
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 등록된 레퍼런스입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  deleteReference(id: number) {
    return this.referenceRepository.delete(id);
  }
}
