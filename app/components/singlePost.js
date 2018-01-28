import React, { Component } from 'react';
import { AppRegistry, Text, WebView } from 'react-native';

export default class SinglePost extends Component {
  render () {
    return (<WebView
      source={{uri: this.props.uri}}
      onError={() => {}}
      renderError={() => (<Text style={{
        textAlign: 'center',
        fontSize: 24,
        margin: 10,
      }}>Brak połączenia z internetem</Text>)}
    />);
  }
}

AppRegistry.registerComponent('SinglePost', () => SinglePost);