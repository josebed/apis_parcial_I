/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AerolineaService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aerolineasList = [];
    for(let i = 0; i < 5; i++){
        const aerolinea: AerolineaEntity = await repository.save({
          nombre: faker.airline.airline().name, 
          descripcion: faker.lorem.sentence(), 
          fechafundacion: faker.date.past(), 
          paginaweb: faker.internet.url()})
        aerolineasList.push(aerolinea);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineasList.length);
  });

  it('findOne should return a aerolinea by id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineasList[0];
    const aerolinea: AerolineaEntity = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre)
    expect(aerolinea.descripcion).toEqual(storedAerolinea.descripcion)
    expect(aerolinea.fechafundacion).toEqual(storedAerolinea.fechafundacion)
    expect(aerolinea.paginaweb).toEqual(storedAerolinea.paginaweb)
  });

  it('findOne should throw an exception for an invalid aerolinea', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La aerolinea con el id dado no existe")
  });

  it('create should return a new aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.airline.airline().name, 
      descripcion: faker.lorem.sentence(), 
      fechafundacion: faker.date.past(), 
      paginaweb: faker.internet.url(),
      aeropuertos: []
    }
 
    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();
 
    const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: newAerolinea.id}})
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(newAerolinea.descripcion)
    expect(storedAerolinea.fechafundacion).toEqual(newAerolinea.fechafundacion)
    expect(storedAerolinea.paginaweb).toEqual(newAerolinea.paginaweb)
  });

  it('create should return an error new aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.airline.airline().name, 
      descripcion: faker.lorem.sentence(), 
      fechafundacion: faker.date.future(), 
      paginaweb: faker.internet.url(),
      aeropuertos: []
    }
 
    await expect(() => service.create(aerolinea)).rejects.toHaveProperty("message", "La fecha de fundación es posterior a la fecha actual")
  });

  it('update should modify an aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea.nombre = "New name";
    aerolinea.descripcion = "New description";
    const updatedAerolinea: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(updatedAerolinea).not.toBeNull();
     const storedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(aerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(aerolinea.descripcion)
  });

  it('update should throw an exception for an invalid aerolinea', async () => {
    let aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea = {
      ...aerolinea, nombre: "New name", descripcion: "New description"
    }
    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "La aerolinea con el id dado no existe")
  });

  it('update should throw an exception for an invalid fechafundacion', async () => {
    let aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea = {
      ...aerolinea, fechafundacion: faker.date.future()
    }
    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "La fecha de fundación es posterior a la fecha actual")
  });

  it('delete should remove a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
     const deleteAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(deleteAerolinea).toBeNull();
  });

  it('delete should throw an exception for an invalid aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La aerolinea con el id dado no existe")
  });

});
