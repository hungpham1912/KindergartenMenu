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
    const now = new Date();
    console.log(
      '🚀 ~ file: menus.controller.ts ~ line 28 ~ MenusController ~ demo ~ now',
      now,
    );

    const ts = new Date('2022-10-06T04:25:41.551Z');
    console.log(
      '🚀 ~ file: menus.controller.ts ~ line 34 ~ MenusController ~ demo ~ ts',
      ts,
    );

    if (now < ts) {
      return true;
    }

    return false;
  }
}
