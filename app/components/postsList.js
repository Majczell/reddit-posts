import React, { Component } from 'react';
import { AppRegistry, Button, Image, ListView, Text, TouchableOpacity, WebView, View } from 'react-native';

export default class PostsList extends Component {
  constructor() {
    super();

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      posts: ds,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetch('https://www.reddit.com/.json')
      .then((r) => r.json())
      .then((r) => {
        const posts = r.data.children;
        // console.log(posts);
        this.setState({
          posts: this.state.posts.cloneWithRows(posts),
        });
      });
  }

  renderPost(post) {
    const { permalink: uri, thumbnail, title } = post.data;
    return (<View>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('singlePost', {
          title,
          uri: `https://reddit.com${uri}`,
        })}
      >
        <View style={{ 
          padding: 10,
          alignItems: 'center',
        }}>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: thumbnail }}
          />
          <Text style={{
            marginTop: 5,
            fontSize: 14,  
          }}>{title}</Text>
        </View>
      </TouchableOpacity>
      <View style={{
        backgroundColor: '#D3D3D3',
        height: 1,
        margin: 5,
        alignSelf: 'stretch',
      }} />
    </View>);
  }

  render () {
    let posts = this.state.posts;
    let postsView = (<Text style={{
      textAlign: 'center',
      fontSize: 24,
      margin: 10,
    }}>Brak wpisów</Text>);

    if (posts.getRowCount() > 0) {
      postsView = (<ListView
          dataSource={posts}
          renderRow={(post) => this.renderPost(post)}
        />);
    }
    return (
      <View>
        {postsView}
      </View>
    );
  }
}

AppRegistry.registerComponent('PostsList', () => PostsList);