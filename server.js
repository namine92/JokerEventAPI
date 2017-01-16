
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://amine:amine@ds111479.mlab.com:11479/jokerevent',function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  });

var Event  = require('./app/models/event');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Request URL:', req.originalUrl);
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to joker Events api!' });
});


router.route('/events')

    // create an event (accessed at POST http://localhost:8080/api/events)
    .post(function(req, res) {

        var event = new Event();      // create a new instance of the Event model
        event.title = req.body.title;  // set the event title (comes from the request)
        event.description = req.body.description;
        event.date =  req.body.date;
        event.image = req.body.image;

        // save the bear and check for errors
        event.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Event created!' });
        });

    })
    // get all the events (accessed at GET http://localhost:8080/api/events)
    .get(function(req, res) {
        Event.find(function(err, events) {
            if (err)
                res.send(err);

            res.json(events);
        });
    });


   router.route('/events/:event_id')

    // get the event with that id (accessed at GET http://localhost:8080/api/events/event_id)
    .get(function(req, res) {
        Event.findById(req.params.event_id, function(err, event) {
            if (err)
                res.send(err);
            res.json(event);
        });
    })

    // update the event with this id (accessed at PUT http://localhost:8080/api/events/event_id)
    .put(function(req, res) {

       // use our event model to find the event we want
       Event.findById(req.params.event_id, function(err, event) {

           if (err)
               res.send(err);

               event.title = req.body.title;  // set the event title (comes from the request)
               event.description = req.body.description;
               event.date =  req.body.date;
               event.image = req.body.image;

           // save the event
           event.save(function(err) {
               if (err)
                   res.send(err);

               res.json({ message: 'event updated!' });
           });

       });
   })
   // delete the event with this id (accessed at DELETE http://localhost:8080/api/events/event_id)
    .delete(function(req, res) {
        Event.remove({
            _id: req.params.event_id
        }, function(err, event) {
            if (err){
              res.send(err);
              console.log(err);
            }

            res.json({ message: 'Successfully deleted' });
        });
    });



// REGISTER OUR ROUTES -------------------------------

app.use('/api', router);

// To serve our static files in this case the events images
app.use(express.static('public'));


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server listenning on port: ' + port);
