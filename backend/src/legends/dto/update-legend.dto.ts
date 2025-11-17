import { PartialType } from '@nestjs/swagger';
import { CreateLegendDto } from './create-legend.dto';

export class UpdateLegendDto extends PartialType(CreateLegendDto) {}