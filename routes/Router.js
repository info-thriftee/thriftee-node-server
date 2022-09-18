class Router {

  constructor(app) {
    this.app = app;
  }

  get (route, callback) {
    this.app.get(route, async (request, res) => {
      try {
        let result = await callback();
        res.json({
          success: 1,
          data: result
        });
      } catch (error) {
        console.log(error)
        res.json({
          success: 0,
          error: error,
        });
      }
    });
  }

  post (route, callback) {
    this.app.post(route, async (request, res) => {
      try {

        let result = await callback(request.body);

        res.json({
          success: 1,
          data: result
        });
      } catch (error) {
        console.error(error);
        res.json({
          success: 0,
          error: error
        });
      }
    });
  }
}

module.exports = Router; 