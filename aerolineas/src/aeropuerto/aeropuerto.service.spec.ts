/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AeropuertoService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aeropuertosList = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await repository.save({
          nombre: faker.airline.airport().name, 
          codigo: faker.airline.airport().iataCode,
          pais: faker.location.country(),
          ciudad: faker.location.city()})
        aeropuertosList.push(aeropuerto);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertosList.length);
  });

  it('findOne should return an aeropuerto by id', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertosList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedAeropuerto.nombre)
    expect(aeropuerto.codigo).toEqual(storedAeropuerto.codigo)
    expect(aeropuerto.pais).toEqual(storedAeropuerto.pais)
    expect(aeropuerto.ciudad).toEqual(storedAeropuerto.ciudad)
  });

  it('findOne should throw an exception for an invalid aeropuerto', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El aeropuerto con el id dado no existe")
  });

  it('create should return a new aerpuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.airline.airport().name, 
      codigo: faker.airline.airport().iataCode,
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: []
    }
 
    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();
 
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: newAeropuerto.id}})
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(newAeropuerto.nombre)
    expect(storedAeropuerto.codigo).toEqual(newAeropuerto.codigo)
    expect(storedAeropuerto.ciudad).toEqual(newAeropuerto.ciudad)
    expect(storedAeropuerto.pais).toEqual(newAeropuerto.pais)
  });

  it('create should return an error for new aerpuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.airline.airport().name, 
      codigo: faker.airline.airport().name,
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: []
    }
 
    await expect(() => service.create(aeropuerto)).rejects.toHaveProperty("message", "El código del aeropuerto es incorrecto")
    
  });

  it('update should modify an aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto.nombre = "New name";
    aeropuerto.ciudad = "New city";
    const updatedAeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(updatedAeropuerto).not.toBeNull();
     const storedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre)
    expect(storedAeropuerto.ciudad).toEqual(aeropuerto.ciudad)
  });

  it('update should throw an exception for an invalid code aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto.codigo = "New codigo";
    await expect(() => service.update(aeropuerto.id, aeropuerto)).rejects.toHaveProperty("message", "El código del aeropuerto es incorrecto")
  });

  it('update should throw an exception for an invalid aeropuerto', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto = {
      ...aeropuerto, nombre: "New name", ciudad: "New City"
    }
    await expect(() => service.update("0", aeropuerto)).rejects.toHaveProperty("message", "El aeropuerto con el id dado no existe")
  });

  it('delete should remove an aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await service.delete(aeropuerto.id);
     const deletedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete should throw an exception for an invalid aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El aeropuerto con el id dado no existe")
  });

});
