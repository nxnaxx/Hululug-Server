import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  // 태그 리스트 조회
  @Get()
  async getTagList() {
    return await this.tagsService.getTagList();
  }
}
