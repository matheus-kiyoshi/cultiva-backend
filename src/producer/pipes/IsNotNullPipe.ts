import { PipeTransform, Injectable, ArgumentMetadata, HttpException } from '@nestjs/common';
import { CreateProducerDto } from '../dto/create-producer.dto';

@Injectable()
export class IsNotNullPipe implements PipeTransform {
  transform(value: CreateProducerDto, metadata: ArgumentMetadata) {
    if(!value.cnpj && !value.cpf) throw new HttpException("You must provide either cnpj or cpf", 400)
    else return value;
  }
}