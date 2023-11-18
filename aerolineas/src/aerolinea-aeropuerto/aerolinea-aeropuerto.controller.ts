/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AeropuertoController } from 'src/aeropuerto/aeropuerto.controller';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity/aeropuerto.entity';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {

    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService){}

    @Post(':aerolineaId/airports/:aeropuertoId')
    async addAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
       return await this.aerolineaAeropuertoService.addAirportToAirline(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/airports/:aeropuertoId')
    async findAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
       return await this.aerolineaAeropuertoService.findAirportFromAirline(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/airports')
    async findAeropuertosAerolinea(@Param('aerolineaId') aerolineaId: string){
       return await this.aerolineaAeropuertoService.findAirportsFromAirline(aerolineaId);
    }

    @Put(':aerolineaId/airports')
    async updateAeropuertosAerolinea(@Body() aeropuertosDto: AeropuertoController[], @Param('aerolineaId') aerolineaId: string){
       const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDto)
       return await this.aerolineaAeropuertoService.updateAirportsFromAirline(aerolineaId, aeropuertos);
    }

    @Delete(':aerolineaId/airports/:aeropuertoId')
    @HttpCode(204)
   async deleteAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
       return await this.aerolineaAeropuertoService.deleteAirportFromAirline(aerolineaId, aeropuertoId);
   }
}
