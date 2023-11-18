/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoService {

    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ){}

    async findAll(): Promise<AeropuertoEntity[]> {
        return await this.aeropuertoRepository.find({ relations: ["aerolineas"] });
    }

    async findOne(id: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id}, relations: ["aerolineas"] } );
        if (!aeropuerto)
          throw new BusinessLogicException("El aeropuerto con el id dado no existe", BusinessError.NOT_FOUND);
   
        return aeropuerto;
    }

    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {

        if(! /^[a-zA-Z]{3}$/.test(aeropuerto.codigo))
            throw new BusinessLogicException("El código del aeropuerto es incorrecto", BusinessError.NOT_FOUND);

        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {

        if(! /^[a-zA-Z]{3}$/.test(aeropuerto.codigo))
            throw new BusinessLogicException("El código del aeropuerto es incorrecto", BusinessError.NOT_FOUND);
        
        const persistedAeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
        if (!persistedAeropuerto)
          throw new BusinessLogicException("El aeropuerto con el id dado no existe", BusinessError.NOT_FOUND);
        
        return await this.aeropuertoRepository.save({...persistedAeropuerto, ...aeropuerto});
    }

    async delete(id: string) {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
        if (!aeropuerto)
          throw new BusinessLogicException("El aeropuerto con el id dado no existe", BusinessError.NOT_FOUND);
     
        await this.aeropuertoRepository.remove(aeropuerto);
    }
}
