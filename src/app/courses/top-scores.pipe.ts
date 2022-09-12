import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'topScores'
})
export class TopScoresPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
