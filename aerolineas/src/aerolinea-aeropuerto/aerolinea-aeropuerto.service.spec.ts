/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList : AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AerolineaAeropuertoService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });


  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aeropuertosList = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
          nombre: faker.airline.airport().name, 
          codigo: faker.airline.airport().iataCode,
          pais: faker.location.country(),
          ciudad: faker.location.city()
        })
        aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      nombre: faker.airline.airline().name, 
      descripcion: faker.lorem.sentence(), 
      fechafundacion: faker.date.past(), 
      paginaweb: faker.internet.url(), 
      aeropuertos: aeropuertosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAeropuertoAerolinea should add an aeropuerto to an aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name, 
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.airline.airline().name, 
      descripcion: faker.lorem.sentence(), 
      fechafundacion: faker.date.past(), 
      paginaweb: faker.internet.url()
    })
 
    const result: AerolineaEntity = await service.addAirportToAirline(newAerolinea.id, newAeropuerto.id);
   
    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre)
    expect(result.aeropuertos[0].codigo).toBe(newAeropuerto.codigo)
    expect(result.aeropuertos[0].pais).toBe(newAeropuerto.pais)
    expect(result.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad)
  });

  it('addAeropuertoAerolinea should thrown exception for an invalid aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.airline.airline().name, 
      descripcion: faker.lorem.sentence(), 
      fechafundacion: faker.date.past(), 
      paginaweb: faker.internet.url()
    })
 
    await expect(() => service.addAirportToAirline(newAerolinea.id, "0")).rejects.toHaveProperty("message", "El aeropuerto con el Id dado no existe");
  });

  it('addAeropuertoAerolinea should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name, 
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    await expect(() => service.addAirportToAirline("0", newAeropuerto.id)).rejects.toHaveProperty("message", "La aerolínea con el Id dado no existe");
  });

  it('findAeropuertoAerolinea should return aeropuerto by aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedAeropuerto: AeropuertoEntity = await service.findAirportFromAirline(aerolinea.id, aeropuerto.id, )
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toBe(aeropuerto.nombre);
    expect(storedAeropuerto.codigo).toBe(aeropuerto.codigo);
    expect(storedAeropuerto.ciudad).toBe(aeropuerto.ciudad);
    expect(storedAeropuerto.pais).toBe(aeropuerto.pais);
  });

  it('findAeropuertoAerolinea should throw an exception for an invalid aeropuerto', async () => {
    await expect(()=> service.findAirportFromAirline(aerolinea.id, "0")).rejects.toHaveProperty("message", "El aeropuerto con el Id dado no existe");
  });

  it('findAeropuertoAerolinea should throw an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(()=> service.findAirportFromAirline("0", aeropuerto.id)).rejects.toHaveProperty("message", "La aerolínea con el Id dado no existe");
  });

  it('findAeropuertoAerolinea should throw an exception for an aeropuerto not associated to the aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name, 
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    await expect(()=> service.findAirportFromAirline(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "El aeropuerto con el Id dado no está asociado con la aerolínea");
  });

  it('findAeropuertosByAerolineaId should return aeropuertos by aerolinea', async ()=>{
    const aeropuertos: AeropuertoEntity[] = await service.findAirportsFromAirline(aerolinea.id);
    expect(aeropuertos.length).toBe(5)
  });

  it('findAeropuertosByAerolineaId should throw an exception for an invalid aerolinea', async () => {
    await expect(()=> service.findAirportsFromAirline("0")).rejects.toHaveProperty("message", "La aerolínea con el Id dado no existe");
  });

  it('updateAeropuertosAerolinea should update aeropuertos list for an aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name, 
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    const updatedAerolinea: AerolineaEntity = await service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto]);
    expect(updatedAerolinea.aeropuertos.length).toBe(1);
 
    expect(updatedAerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
    expect(updatedAerolinea.aeropuertos[0].codigo).toBe(newAeropuerto.codigo);
    expect(updatedAerolinea.aeropuertos[0].pais).toBe(newAeropuerto.pais);
    expect(updatedAerolinea.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad);
  });

  it('updateAeropuertosAerolinea should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name, 
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    await expect(()=> service.updateAirportsFromAirline("0", [newAeropuerto])).rejects.toHaveProperty("message", "La aerolínea con el Id dado no existe");
  });

  it('updateAeropuertosAerolinea should throw an exception for an invalid aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosList[0];
    newAeropuerto.id = "0";
 
    await expect(()=> service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto])).rejects.toHaveProperty("message", "El aeropuerto con el Id dado no existe");
  });

  it('deleteAeropuertoAerolinea should remove an aeropurto from an aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
   
    await service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id);
 
    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({where: {id: aerolinea.id}, relations: ["aeropuertos"]});
    const deletedAeropuerto: AeropuertoEntity = storedAerolinea.aeropuertos.find(a => a.id === aeropuerto.id);
 
    expect(deletedAeropuerto).toBeUndefined();
 
  });

  it('deleteAeropuertoAerolinea should thrown an exception for an invalid aeropuerto', async () => {
    await expect(()=> service.deleteAirportFromAirline(aerolinea.id, "0")).rejects.toHaveProperty("message", "El aeropuerto con el Id dado no existe");
  });

  it('deleteAeropuertoAerolinea should thrown an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(()=> service.deleteAirportFromAirline("0", aeropuerto.id)).rejects.toHaveProperty("message", "La aerolínea con el Id dado no existe");
  });

  it('deleteAeropuertoAerolinea should thrown an exception for a non-asocciated aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.airline.airport().name, 
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city()
    });
 
    await expect(()=> service.deleteAirportFromAirline(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "El aeropuerto con el Id dado no está asociado con la aerolínea");
  });


});
