const { send } = require('micro');
const cors = require('micro-cors');
var Nbrite = require('nbrite');

function getToken() {
    return process.env.EB_TOKEN;
}

function eventbrite() {

  const EVENTBRITE_ACCESS_TOKEN = getToken();

  console.log(EVENTBRITE_ACCESS_TOKEN);

  var nbrite = new Nbrite({token: EVENTBRITE_ACCESS_TOKEN });

  return nbrite.get('/users/me/owned_events', { status: 'live' }).then(function (res) {
      if (res.events) {
        return res.events;
      }

      return {};
  });

}

const handler = async (req, res) => {
    const events = await eventbrite();
    res.setHeader('Access-Control-Allow-Origin', '*')
    send(res, 200, events);
};

module.exports = handler;