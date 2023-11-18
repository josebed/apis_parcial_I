import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AerolineaService } from '../aerolinea/aerolinea.service';
import { AeropuertoService } from '../aeropuerto/aeropuerto.service';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';

@Module({
  providers: [AerolineaService, AeropuertoService, AerolineaAeropuertoService],
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  controllers: [AerolineaAeropuertoController],
})
export class AerolineaAeropuertoModule {}
