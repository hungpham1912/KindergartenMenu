import { Controller, Post } from '@nestjs/common';
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
}
