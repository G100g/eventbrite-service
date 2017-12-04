const Nbrite = require("nbrite");
const jsonfile = require("jsonfile");
const eventbriteToken = "6BGXJFRC4WZTG4KVWARZ";
const nbrite = new Nbrite({
	token: eventbriteToken
});
const eventsFilename = "./out/events.json";

const reducePayload = (items, event) => {
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
};

const getEvents = () => {
	return nbrite.get("/users/me/owned_events", {
		status: "live"
	}).then(function (res) {
		if (res.events) {
			return res.events.reduce(reducePayload, []);
		}

		return {};
	});
};

getEvents().then((events) => {
	jsonfile.writeFileSync(eventsFilename, events);
});