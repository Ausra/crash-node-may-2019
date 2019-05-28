import { AmbassadorTestkit } from '@wix/ambassador-testkit';
import { NodeWorkshopScalaApp } from '@wix/ambassador-node-workshop-scala-app/rpc';

describe('React application', () => {
  const ambassadorTestkit = new AmbassadorTestkit();
  ambassadorTestkit.beforeAndAfter();
  afterEach(() => ambassadorTestkit.reset());

  it('should display list and input fields', async () => {
    const commentsServiceStub = ambassadorTestkit.createStub(
      NodeWorkshopScalaApp,
    );

    const comments = [
      { author: 'Yaniv', text: 'My great comment' },
      { author: 'Yaniv1', text: 'My great comment1' },
      { author: 'Yaniv2', text: 'My great comment3' },
    ];

    commentsServiceStub
      .CommentsService()
      .fetch.when(siteId => {
        return siteId === 'eb6f81e2-4b03-4d6e-955f-a1b4abf6bbcf';
      })
      .resolve(comments);

    await page.goto(app.getUrl('/'));

    expect(await page.$('#comments-list')).not.toBe(null);
    expect(await page.$('#comment')).not.toBe(null);
    expect(await page.$('#name')).not.toBe(null);
    expect(await page.$('#add-button')).not.toBe(null);
  });

  it('should add comment', async () => {
    let comment;
    const commentsServiceStub = ambassadorTestkit.createStub(
      NodeWorkshopScalaApp,
    );

    const comments = [
      { author: 'Yaniv', text: 'My great comment' },
      { author: 'Yaniv1', text: 'My great comment1' },
      { author: 'Yaniv2', text: 'My great comment3' },
    ];

    commentsServiceStub
      .CommentsService()
      .fetch.when(siteId => {
        return siteId === 'eb6f81e2-4b03-4d6e-955f-a1b4abf6bbcf';
      })
      .resolve(comments);

    commentsServiceStub
      .CommentsService()
      .add.when((siteId, actualtComment) => {
        if (siteId === 'eb6f81e2-4b03-4d6e-955f-a1b4abf6bbcf') {
          comment = actualtComment;
        }
        return true;
      })
      .resolve(null);

    await page.goto(app.getUrl('/'));
    await page.type('#name', 'Google');
    await page.type('#comment', 'Awesome Comment');

    await page.click('#add-button');

    await page.waitForSelector('[data-testid="3"]');

    expect(await page.$eval('[data-testid="3"]')).toEqual(
      'Yaniv My great comment',
    );
  });
});
