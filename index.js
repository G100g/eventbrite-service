const { send } = require('micro');
const Nbrite = require('nbrite');

const url = require('url') ;

const CacheManager = require('./libs/cacheManager');

CacheManager.timeout(4 * 60 * 60 * 1000);

const EVENTBRITE_ACCESS_TOKEN = getToken();
const nbrite = new Nbrite({token: EVENTBRITE_ACCESS_TOKEN });

function getToken() {
    return process.env.EB_TOKEN;
}

function reducePayload(items, event) {

    items.push({
        id: parseInt(event.id),
        name: event.name,
        start: event.start,
        end: event.end,
        url: event.url,
        logo: event.logo,
        description: event.description,
        capacity: event.capacity,
    });

    return items;

}

function events() {

    return CacheManager.update('events', nbrite.get('/users/me/owned_events', { status: 'live' }).then(function (res) {
                                                if (res.events) {
                                                    return res.events.reduce(reducePayload, []);
                                                }

                                                return {};
                                            })
                                        );

}

function attendees(id) {
  return nbrite.get(`/events/${id}/attendees/`, { status: 'attending' }).then(function (res) {
      if (res.pagination) {
        return {
            partecipants: res.pagination.object_count
        };
      }

      return {};
  });
}

const handler = async (req, res) => {
    
    var queryObject = url.parse(req.url,true).query;
    let response = {};

    if (queryObject.eventid) {
        response = await attendees(queryObject.eventid);
    } else {
        response = await events();
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader('last-cache-update', CacheManager.lastUpdate)
    send(res, 200, response);
};

module.exports = handler;