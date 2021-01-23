import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import TagsInput from '../TagsInput/TagsInput';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tags: ['art']
    };
  }
  setTags = (state) => {
    this.setState(state)
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <TagsInput setTags={this.setTags} tags={this.state.tags} />
        </div>
        <Gallery tags={this.state.tags} />
      </div>
    );
  }
}

export default App;
