import { PartialType } from "@nestjs/swagger";
import { CreateDiplomaDto } from "src/modules/diplomas/dto/create-diploma.dto";

export class UpdateDiplomaDto extends PartialType(CreateDiplomaDto) {}