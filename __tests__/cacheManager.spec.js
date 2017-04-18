const chai = require('chai');
const expect = chai.expect;
const CacheManager = require('../libs/cacheManager');

describe('Cache Manager', () => {
    it('Should return a promise', () => {

        const result = CacheManager.update('events', Promise.resolve({ 'events': 2 }))
        expect(result).is.instanceOf(Promise);

    });

    it('Should return cached result', () => {

        return CacheManager.update('events', Promise.resolve({ 'events': 3 })
                    ).then(results => {
                        expect(results.events).to.equal(2);
                    });

    });

    it('Should set lastTime to now', () => {
        return CacheManager.update('events2', Promise.resolve({ 'events': 3 }))
                    .then(results => {
                        const now = new Date().getTime();
                        expect(CacheManager.lastUpdate).to.equal(now);
                    });
    });

    it('Should return new result after 1sec', () => {

        CacheManager.timeout(1000);

        return CacheManager.update('events2', Promise.resolve({ 'events': 4 }))
                    .then(results => {
                        expect(results.events).to.equal(3);

                        return new Promise((resolve) => {
                            setTimeout(() => {
                                CacheManager.update('events2', Promise.resolve({ 'events': 5 })).then(result => {
                                    resolve(result)
                                });
                            }, 1000);
                        });
                    })
                    .then(results => {
                        expect(results.events).to.equal(5);
                    });
    });
});