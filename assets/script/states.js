class States {
    constructor() {
        this.state = {"current_batch":{
            "id":1,
            "closed":"true"
        }};
    }

    // Merge new state directly into the existing state
    setState(newState = {}) {
        this.state = Object.assign(this.state, newState);
    }

    // Retrieve the value of a specific state key
    getState(stateKey = "") {
        return stateKey ? this.state[stateKey] : this.state;
    }

    removeState(stateKey = "") {
        if (!stateKey) {
          // If no key provided, clear all state
          this.state = {};
          return true;
        }
    
        if (Object.prototype.hasOwnProperty.call(this.state, stateKey)) {
          delete this.state[stateKey];
          return true;
        }
    
        // Key not found; consider it a successful no-op or false based on preference
        // Here we return false to indicate nothing was removed
        return false;
    }
}
const globalStates=new States();


