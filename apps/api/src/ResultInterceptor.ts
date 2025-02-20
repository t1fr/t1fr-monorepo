import { type CallHandler, ConflictException, type ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from 'ts-results-es';

@Injectable()
export class ResultTransformer implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next
            .handle()
            .pipe(map(value => {
                if (!Result.isResult(value)) return value;

                if (value.isOk()) return value.value;
                throw new ConflictException(`${value.error}`)
            }));
    }
}
