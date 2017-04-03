import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class EmojiService {

  constructor(private http: Http) { }

  private emojiUrl : string = "assets/data/emoji.json"
  getEmojis(): Promise<string[]>{
      return this.http.get(this.emojiUrl)
                .toPromise()
                .then((response) => {
                  return response.json().data as string[];
                })
                .catch(this.handleError);
    }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
