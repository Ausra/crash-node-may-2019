import wixExpressCsrf from '@wix/wix-express-csrf';
import wixExpressRequireHttps from '@wix/wix-express-require-https';
import { hot } from 'bootstrap-hot-loader';
import { NodeWorkshopScalaApp } from '@wix/ambassador-node-workshop-scala-app/rpc';
import bodyParser from 'body-parser';

// This function is the main entry for our server. It accepts an express Router
// (see http://expressjs.com) and attaches routes and middlewares to it.
//
// `context` is an object with built-in services from `wix-bootstrap-ng`. See
// https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap/wix-bootstrap-ng).
export default hot(module, (app, context) => {
  // We load the already parsed ERB configuration (located at /templates folder).
  const config = context.config.load('crash-node-may-2019');
  const commentsService = NodeWorkshopScalaApp().CommentsService();
  // Attach CSRF protection middleware. See
  // https://github.com/wix-platform/wix-node-platform/tree/master/express/wix-express-csrf.
  app.use(wixExpressCsrf());

  // Require HTTPS by redirecting to HTTPS from HTTP. Only active in a production environment.
  // See https://github.com/wix-platform/wix-node-platform/tree/master/express/wix-express-require-https.
  app.use(wixExpressRequireHttps);
  app.use(bodyParser.json());
  // Attach a rendering middleware, it adds the `renderView` method to every request.
  // See https://github.com/wix-private/fed-infra/tree/master/wix-bootstrap-renderer.
  app.use(context.renderer.middleware());

  app.get('/comments', async (req, res) => {
    const comments = await commentsService(req.aspects).fetch(
      'eb6f81e2-4b03-4d6e-955f-a1b4abf6bbcf',
    );
    res.send(comments);
  });

  app.post('/comments', async (req, res) => {
    await commentsService(req.aspects).add(
      'eb6f81e2-4b03-4d6e-955f-a1b4abf6bbcf',
      req.body,
    );
    res.end();
  });
  // Define a route to render our initial HTML.
  app.get('/', (req, res) => {
    // Extract some data from every incoming request.
    const renderModel = getRenderModel(req);

    // Send a response back to the client.
    res.renderView('./index.ejs', renderModel);
  });

  function getRenderModel(req) {
    const { language, basename, debug } = req.aspects['web-context'];

    return {
      language,
      basename,
      debug: debug || process.env.NODE_ENV === 'development',
      title: 'Wix Full Stack Project Boilerplate',
      staticsDomain: config.clientTopology.staticsDomain,
    };
  }

  return app;
});
