import { TestBed, inject } from '@angular/core/testing';

import { EmojiService } from './emoji.service';

describe('EmojiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmojiService]
    });
  });

  it('should ...', inject([EmojiService], (service: EmojiService) => {
    expect(service).toBeTruthy();
  }));
});
