import React, { Component } from 'react';
import { AppRegistry, Button, Image, ListView, Text, TouchableOpacity, WebView, View } from 'react-native';
import RNFS from 'react-native-fs';

const cacheDir = RNFS.CachesDirectoryPath;
const cacheFilePath = `${cacheDir}/redditPosts.json`;

export default class PostsList extends Component {
  constructor() {
    super();

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      posts: ds,
      ready: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  async saveDataToDevice(posts) {
    Promise.all(posts.map(post => {
      if (!post.thumbnail) {
        return;
      }
      return RNFS.downloadFile({
        fromUrl: post.thumbnail,
        toFile: `${cacheDir}/image-${post.id}.jpg`,
      }).promise;
    }));

    await RNFS.writeFile(cacheFilePath, JSON.stringify(posts));
  }

  async loadData() {
    let posts = [];
    try {
      posts = await RNFS.readFile(cacheFilePath);
      posts = JSON.parse(posts);
    } catch(e) {}

    this.setState({
      posts: this.state.posts.cloneWithRows(posts),
      ready: true,
    });
  }

  getData() {
    (async () => {
      let posts;
      try {
        posts = await fetch('https://www.reddit.com/.json'); 
      } catch(e) {}
      if (posts) {
        posts = await posts.json();
        posts = posts.data.children.map((post, i) => ({
          id: i,
          url: `https://reddit.com${post.data.permalink}`,
          title: post.data.title,
          thumbnail: post.data.thumbnail.indexOf('http') > -1 ? post.data.thumbnail : null,
        }));
        await this.saveDataToDevice(posts);
      }
      await this.loadData();
    })();
  }

  renderPost(post) {
    const { id, url, thumbnail, title } = post;
    let image;
    if (thumbnail) {
      image = (<Image
        style={{ width: 80, height: 80, borderRadius: 40 }}
        source={{ uri: `file://${cacheDir}/image-${id}.jpg` }}
      />);
    }
    return (<View>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('singlePost', {
          title,
          uri: url,
        })}
      >
        <View style={{ 
          padding: 10,
          // alignItems: 'center',
          flexDirection: 'row',
        }}>
          {image}
          <Text style={{
            // marginTop: 5,
            // fontSize: 14,
            flex: 1,
            paddingLeft: 5,
          }}>{title}</Text>
        </View>
      </TouchableOpacity>
      <View style={{
        backgroundColor: '#D3D3D3',
        height: 1,
        alignSelf: 'stretch',
      }} />
    </View>);
  }

  render () {
    let { posts, ready } = this.state;
    let postsView = (<Text style={{
      textAlign: 'center',
      fontSize: 24,
      margin: 10,
    }}>Ładowanie wpisów...</Text>);

    if (ready) {
      postsView = (<Text style={{
        textAlign: 'center',
        fontSize: 24,
        margin: 10,
      }}>Brak wpisów</Text>);
    }

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