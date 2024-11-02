import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import {
  WorldcupListService,
  WorldcupRamenInfoService,
  WorldcupSelectService,
} from './services';

@Controller('events/worldcup')
export class WorldcupController {
  constructor(
    private worldcupListService: WorldcupListService,
    private worldcupRamenInfoService: WorldcupRamenInfoService,
    private worldcupSelectService: WorldcupSelectService,
  ) {}

  // 월드컵 이벤트 라면 리스트 조회(total_count 함께 제공)
  @Get('/ramen')
  async getRamenList() {
    const data = await this.worldcupListService.getRamenList();
    return { ramen: data.ramen, total_count: data.total_count };
  }

  // 월드컵 이벤트 라면 정보 조회
  @Get('/ramen/:id')
  async getRamenInfo(@Param('id') id: string) {
    const data = await this.worldcupRamenInfoService.getRamenInfo(id);
    return { title: data.title, image: data.image, count: data.count };
  }

  // 월드컵 이벤트 최종 선택 라면 카운트
  @Patch('/ramen')
  async selectRamen(@Body('ramen_id') id: string) {
    await this.worldcupSelectService.selectRamen(id);
  }
}
