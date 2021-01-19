import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeSince',
  pure: false,
})
export class TimeSincePipe implements PipeTransform {
  transform(dateString: string): string {
    const date = new Date(dateString).getTime();
    const seconds = Math.floor((new Date().getTime() - date) / 1000);

    let interval = seconds / 31536000;
    let agoDate: number;

    if (interval > 1) {
      agoDate = Math.floor(interval);
      return agoDate + (agoDate === 1 ? ' year' : ' years');
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      agoDate = Math.floor(interval);
      return agoDate + (agoDate === 1 ? ' month' : ' months');
    }
    interval = seconds / 86400;
    if (interval > 1) {
      agoDate = Math.floor(interval);
      return agoDate + (agoDate === 1 ? ' day' : ' days');
    }
    interval = seconds / 3600;
    if (interval > 1) {
      agoDate = Math.floor(interval);
      return agoDate + (agoDate === 1 ? ' hour' : ' hours');
    }
    interval = seconds / 60;
    if (interval > 1) {
      agoDate = Math.floor(interval);
      return agoDate + (agoDate === 1 ? ' minute' : ' minutes');
    }
    agoDate = Math.floor(seconds);
    return agoDate + (agoDate === 1 ? ' second' : ' seconds');
  }
}
