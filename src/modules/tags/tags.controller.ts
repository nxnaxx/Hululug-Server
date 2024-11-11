import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiResponse } from '@nestjs/swagger';
import { GetTagsDto } from './dto';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  // 태그 리스트 조회
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetTagsDto,
  })
  async getTagList() {
    return await this.tagsService.getTagList();
  }
}
