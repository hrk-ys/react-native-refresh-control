'use strict';

var React = require('react-native');
var RNRefreshControl = require('NativeModules').RNRefreshControlManager;
var {
  DeviceEventEmitter
} = React;

var DROP_VIEW_DID_BEGIN_REFRESHING_EVENT = 'dropViewDidBeginRefreshing';

var callbacks = {};

var subscription = DeviceEventEmitter.addListener(
  DROP_VIEW_DID_BEGIN_REFRESHING_EVENT,
  (reactTag) => callbacks[reactTag]()
);

var RefreshControl = {
  configure: function(configs, callback) {
    var nodeHandle = React.findNodeHandle(configs.node);
    var options = {
      title:     configs.title,
      tintColor: configs.tintColor,
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

module.exports = RefreshControl;
