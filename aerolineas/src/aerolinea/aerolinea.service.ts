/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AerolineaService {

    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ){}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({ relations: ["aeropuertos"] });
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}, relations: ["aeropuertos"] } );
        if (!aerolinea)
          throw new BusinessLogicException("La aerolinea con el id dado no existe", BusinessError.NOT_FOUND);
   
        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (aerolinea.fechafundacion >= today)
            throw new BusinessLogicException("La fecha de fundación es posterior a la fecha actual", BusinessError.PRECONDITION_FAILED);

        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (aerolinea.fechafundacion >= today)
            throw new BusinessLogicException("La fecha de fundación es posterior a la fecha actual", BusinessError.PRECONDITION_FAILED);
        
        const persistedAerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!persistedAerolinea)
          throw new BusinessLogicException("La aerolinea con el id dado no existe", BusinessError.NOT_FOUND);
        
        return await this.aerolineaRepository.save({...persistedAerolinea, ...aerolinea});
    }

    async delete(id: string) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!aerolinea)
          throw new BusinessLogicException("La aerolinea con el id dado no existe", BusinessError.NOT_FOUND);
     
        await this.aerolineaRepository.remove(aerolinea);
    }
}
