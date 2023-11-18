/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AerolineaDto } from './aerolinea.dto/aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { plainToInstance } from 'class-transformer';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {

    constructor(private readonly aerolineaService: AerolineaService) {}

    @Get()
    async findAll() {
      return await this.aerolineaService.findAll();
    }

    @Get(':aerolineaId')
    async findOne(@Param('aerolineaId') aerolineaId: string) {
        return await this.aerolineaService.findOne(aerolineaId);
    }

    @Post()
    async create(@Body() aerolineaDTO: AerolineaDto) {
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDTO);
    return await this.aerolineaService.create(aerolinea);
    }

    @Put(':aerolineaId')
    async update(@Param('aerolineaId') aerolineaId: string, @Body() aerolineaDTO: AerolineaDto) {
      const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDTO);
      return await this.aerolineaService.update(aerolineaId, aerolinea);
    }

    @Delete(':aerolineaId')
    @HttpCode(204)
    async delete(@Param('aerolineaId') aerolineaId: string) {
        return await this.aerolineaService.delete(aerolineaId);
    }
}
