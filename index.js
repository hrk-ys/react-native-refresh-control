'use strict';

var React = require('react-native');
var {
  Component,
  ListView,
  ScrollView,
} = React;

var RNRefreshControl = require('NativeModules').RNRefreshControlManager;
var {
  DeviceEventEmitter
} = React;

var DROP_VIEW_DID_BEGIN_REFRESHING_EVENT = 'dropViewDidBeginRefreshing';
var LISTVIEW   = 'listView';
var SCROLLVIEW = 'scrollView';

var callbacks = {};

var subscription = DeviceEventEmitter.addListener(
  DROP_VIEW_DID_BEGIN_REFRESHING_EVENT,
  (reactTag) => callbacks[reactTag]()
);

var RefreshControl = {
  configure: function(configs, callback) {
    var nodeHandle = React.findNodeHandle(configs.node);
    var options = {
      tintColor:  configs.tintColor,
      title:      configs.title,
      titleColor: configs.titleColor,
    };

    RNRefreshControl.configure(nodeHandle, options, (error) => {
      if (!error) {
        callbacks[nodeHandle] = callback;
      }
    });
  },
  endRefreshing: function(node) {
    var nodeHandle = React.findNodeHandle(node);
    RNRefreshControl.endRefreshing(nodeHandle);
  }
};

// var props = {
//   refreshDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
//   refreshTintColor:   PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
// }

class RefreshableListView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    RefreshControl.configure({
      node: this.refs[LISTVIEW],
      title: this.props.refreshDescription,
      tintColor: this.props.refreshTintColor,
      titleColor: this.props.refreshTitleColor,
    }, () => {
      this.props.onRefresh().then( () =>  {
        RefreshControl.endRefreshing(this.refs[LISTVIEW]);
      });
    });
  }

  render() {
    return <ListView ref={LISTVIEW} {...this.props} />
  }
}

class RefreshableScrollView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    RefreshControl.configure({
      node: this.refs[SCROLLVIEW]
    }, () => {
      this.props.onRefresh().then( () =>  {
        RefreshControl.endRefreshing(this.refs[SCROLLVIEW]);
      });
    });
  }

  render() {
    return (
      <ScrollView
        ref={SCROLLVIEW}
        {...this.props}
        />
    )
  }
}
module.exports = {
  RefreshControl,
  RefreshableListView,
  RefreshableScrollView,
};
