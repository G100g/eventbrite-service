const CacheManager = {
    last_update: null,
    keys: {},
    lastUpdate: null,
    timeoutMilliseconds: 3000,
    touch() {
        this.lastUpdate = new Date().getTime();
    },
    timeout(m) {
        this.timeoutMilliseconds = m;
    },
    isOld() {
        const now = new Date().getTime();
        // console.log(now, this.lastUpdate, now - this.lastUpdate, this.timeoutMilliseconds);
        return !!( now - this.lastUpdate > this.timeoutMilliseconds)
    },
    update(key, eventsPromise) {                
        if (key in this.keys && !this.isOld()) {
            return Promise.resolve(this.keys[key]);
        } else {            
            return eventsPromise.then(result => {
                this.touch();
                return this.keys[key] = result
            });
        }
    }
}

CacheManager.touch();

module.exports = CacheManager;