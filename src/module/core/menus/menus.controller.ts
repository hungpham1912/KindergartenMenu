import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MenusService } from './menus.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Menu')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  genKindergarten() {
    return this.menusService.genKindergarten();
  }

  @Post('add')
  add() {
    return this.menusService.create();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.menusService.delete(id);
  }

  @Get('demo')
  demo() {
    return this.menusService.suitability(45000, 550);
  }
}
