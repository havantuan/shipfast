import {RouterStore as rStore} from 'mobx-react-router';

class RouterStore extends rStore {

  push(query) {
    super.push(query)
  }
}

export default new RouterStore();
