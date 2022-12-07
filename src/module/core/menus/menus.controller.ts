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

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.menusService.delete(id);
  }

  @Get('demo')
  demo() {
    const test = '0101011010';
    const ts = this.replaceAt(test, 3, '0');
    console.log(
      '🚀 ~ file: menus.controller.ts ~ line 29 ~ MenusController ~ demo ~ ts',
      ts,
    );
  }

  replaceAt(str, index, replacement) {
    return (
      str.substring(0, index) +
      replacement +
      str.substring(index + replacement.length)
    );
  }
}
