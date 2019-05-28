import axios from 'axios';
import { AmbassadorTestkit } from '@wix/ambassador-testkit';
import { NodeWorkshopScalaApp } from '@wix/ambassador-node-workshop-scala-app/rpc';

describe('When rendering', () => {
  const ambassadorTestkit = new AmbassadorTestkit();
  ambassadorTestkit.beforeAndAfter();
  afterEach(() => ambassadorTestkit.reset());

  it('should return comments', async () => {
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

    const url = app.getUrl('/comments');
    const response = await axios.get(url);

    expect(response.data).toEqual(comments);
  });

  it('should return comments2', async () => {
    let comment;
    const aComment = { author: 'a', text: 'b ' };
    const commentsServiceStub = ambassadorTestkit.createStub(
      NodeWorkshopScalaApp,
    );

    commentsServiceStub
      .CommentsService()
      .add.when((siteId, actualtComment) => {
        if (siteId === 'eb6f81e2-4b03-4d6e-955f-a1b4abf6bbcf') {
          comment = actualtComment;
        }
        return true;
      })
      .resolve(null);

    const url = app.getUrl('/comments');
    await axios.post(url, aComment);

    expect(comment).toEqual(aComment);
  });
});
