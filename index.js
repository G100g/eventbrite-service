const { send } = require('micro');
var Nbrite = require('nbrite');

function getToken() {
    return process.env.EB_TOKEN;
}

function reducePayload(items, event) {

    items.push({
        name: event.name,
        start: event.start,
        end: event.end,
        url: event.url,
        logo: event.logo,
        description: event.description,
    });

    return items;

}

function eventbrite() {

  const EVENTBRITE_ACCESS_TOKEN = getToken();

  var nbrite = new Nbrite({token: EVENTBRITE_ACCESS_TOKEN });

  return nbrite.get('/users/me/owned_events', { status: 'live' }).then(function (res) {
      if (res.events) {
        return res.events.reduce(reducePayload, []);
      }

      return {};
  });

}

const handler = async (req, res) => {
    const events = await eventbrite();
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    send(res, 200, events);
};

module.exports = handler;