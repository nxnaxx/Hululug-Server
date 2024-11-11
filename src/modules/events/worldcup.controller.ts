import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { WorldcupListService, WorldcupSelectService } from './services';

@Controller('events/worldcup')
export class WorldcupController {
  constructor(
    private worldcupListService: WorldcupListService,
    private worldcupSelectService: WorldcupSelectService,
  ) {}

  // 월드컵 이벤트 라면 정보 리스트 및 total_count 조회
  @Get('/ramen')
  async getRamenList() {
    return await this.worldcupListService.getRamenList();
  }

  // 월드컵 이벤트 최종 선택 라면 카운트
  @Patch('/ramen')
  async selectRamen(@Body('ramen_id') id: string) {
    await this.worldcupSelectService.selectRamen(id);
  }
}
