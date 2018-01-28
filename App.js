import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import PostsList from './app/components/postsList';
import SinglePost from './app/components/singlePost';

const AppNavigator = StackNavigator({
  postsList: {
    screen: PostsList,
    navigationOptions: ({navigation}) => ({
      title: 'Reddit Posts',
    }),
  },
  singlePost: {
    screen: ({navigation}) => {
      const props = navigation.state.params;
      return (<SinglePost {...props}/>);
    },
    navigationOptions: ({navigation}) => ({
      title: navigation.state.params.title,
      headerBackTitle: true,
    }),
  }
});

export default class MyApp extends Component {
  render() {
    return (<AppNavigator />);
  }
}

AppRegistry.registerComponent('MyApp', () => MyApp);