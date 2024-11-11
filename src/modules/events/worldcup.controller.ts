import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { WorldcupListService, WorldcupSelectService } from './services';
import { ApiResponse } from '@nestjs/swagger';
import { GetWorldCupRamenDto, SelectRamenDto } from './dto';

@Controller('events/worldcup')
export class WorldcupController {
  constructor(
    private worldcupListService: WorldcupListService,
    private worldcupSelectService: WorldcupSelectService,
  ) {}

  // 월드컵 이벤트 라면 정보 리스트 및 total_count 조회
  @Get('/ramen')
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: GetWorldCupRamenDto,
  })
  async getRamenList() {
    return await this.worldcupListService.getRamenList();
  }

  // 월드컵 이벤트 최종 선택 라면 카운트
  @Patch('/ramen')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async selectRamen(@Body() id: SelectRamenDto) {
    await this.worldcupSelectService.selectRamen(id.ramen_id);
  }
}
