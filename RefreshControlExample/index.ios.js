/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var RefreshControl = require('react-native-refresh-control');
var {
  AppRegistry,
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
} = React;

var SCROLLVIEW = 'ScrollView';
var LISTVIEW = 'ListView';

var RefreshControlExample = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(['#484848', '#2F9C0A', '#05A5D1']),
    };
  },

  componentDidMount: function() {

    // ScrollView
    RefreshControl.configure({
      node: this.refs[SCROLLVIEW],
      tintColor: '#05A5D1',
      activityIndicatorViewColor: '#05A5D1'
    }, () => {
      this.setTimeout(() => {
        RefreshControl.endRefreshing(this.refs[SCROLLVIEW]);
      }, 2000);
    });

    // ListView
    RefreshControl.configure({
      node: this.refs[LISTVIEW]
    }, () => {
      this.setTimeout(() => {
        RefreshControl.endRefreshing(this.refs[LISTVIEW]);
      }, 2000);
    });
  },

  render: function() {
    return (
      <View style={styles.container}>
        <ScrollView ref={SCROLLVIEW} style={styles.scrollView}>
          <View style={{backgroundColor: '#05A5D1', height: 200}} />
          <View style={{backgroundColor: '#FDF3E7', height: 200}} />
          <View style={{backgroundColor: '#484848', height: 200}} />
        </ScrollView>

        <ListView
          ref={LISTVIEW}
          style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
            var color = rowData;
            return (
              <View style={{backgroundColor: color, height: 200}} />
            );
          }}
        />
      </View>
    );
  }
});

var Navi = React.createClass({
  render() {
    return (
      <NavigatorIOS
        style={{flex: 1}}
        titleTextColor={'white'}
        initialRoute={{
          component: RefreshControlExample,
          title: 'ホーム',
        }}
      />
    );
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
});

AppRegistry.registerComponent('RefreshControlExample', () => Navi);
