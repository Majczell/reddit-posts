import React, { Component } from 'react';
import { AppRegistry, WebView } from 'react-native';

export default class SinglePost extends Component {
  render () {
    return (<WebView
      source={{uri: this.props.uri}}
    />);
  }
}

AppRegistry.registerComponent('SinglePost', () => SinglePost);