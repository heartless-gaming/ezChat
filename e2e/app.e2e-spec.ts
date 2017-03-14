import { EzChatPage } from './app.po';

describe('ez-chat App', () => {
  let page: EzChatPage;

  beforeEach(() => {
    page = new EzChatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
