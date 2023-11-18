/* eslint-disable prettier/prettier */
import { AerolineaEntity } from "../../aerolinea/aerolinea.entity/aerolinea.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AeropuertoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    codigo: string;

    @Column()
    pais: string;

    @Column()
    ciudad: string;

    @ManyToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
    aerolineas: AerolineaEntity[];

}
