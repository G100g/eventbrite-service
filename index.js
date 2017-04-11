const { send } = require('micro')
var Nbrite = require('nbrite');

function getToken() {
    return process.env.EB_TOKEN;
}

function eventbrite() {

  const EVENTBRITE_ACCESS_TOKEN = getToken();

  var nbrite = new Nbrite({token: EVENTBRITE_ACCESS_TOKEN });

  return nbrite.get('/users/me/owned_events', { status: 'live' }).then(function (res) {
      if (res.events) {
        return res.events;
      }

      return {};
  });

}

module.exports = async (req, res) => {
    const events = await eventbrite();
    send(res, 200, events);
}