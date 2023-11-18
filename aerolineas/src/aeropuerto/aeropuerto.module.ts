import { Module } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';

@Module({
  providers: [AeropuertoService],
  imports: [TypeOrmModule.forFeature([AeropuertoEntity])],
})
export class AeropuertoModule {}
