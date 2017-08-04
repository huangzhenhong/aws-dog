import { AwsDogPage } from './app.po';

describe('aws-dog App', () => {
  let page: AwsDogPage;

  beforeEach(() => {
    page = new AwsDogPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
