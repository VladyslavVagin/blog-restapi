import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersParamDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}