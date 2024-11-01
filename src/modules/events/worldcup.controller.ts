import { Controller, Get } from '@nestjs/common';
import { WorldcupListService } from './services';

@Controller('events/worldcup')
export class WorldcupController {
  constructor(private worldcupListService: WorldcupListService) {}

  // 월드컵 이벤트 라면 리스트 조회(total_count 함께 제공)
  @Get('/ramen')
  async getRamenList() {
    const data = await this.worldcupListService.getRamenList();
    return { ramen: data.ramen, total_count: data.total_count };
  }
}
