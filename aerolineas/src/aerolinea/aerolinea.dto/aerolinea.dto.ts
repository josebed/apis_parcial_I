/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class AerolineaDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsDate()
    @IsNotEmpty()
    readonly fechafundacion: Date;

    @IsUrl()
    @IsNotEmpty()
    readonly paginaweb: string;
}
