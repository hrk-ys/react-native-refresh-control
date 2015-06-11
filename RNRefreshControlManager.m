//
//  RNRefreshControlManager.m
//  RNRefreshControl
//
//  Created by Hiroki Yoshifuji on 2015/06/11.
//  Copyright (c) 2015年 Hiroki Yoshifuji. All rights reserved.
//

#import "RNRefreshControlManager.h"
#import "RCTBridge.h"
#import "RCTConvert.h"
#import "RCTScrollView.h"
#import "RCTSparseArray.h"
#import "RCTUIManager.h"
#import "RCTEventDispatcher.h"


@implementation RNRefreshControlManager

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue {
    return self.bridge.uiManager.methodQueue;
//    return self.bridge.uiManager.methodQueue;
}

RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(configure:(NSNumber *)reactTag
                  options:(NSDictionary *)options
                  callback:(RCTResponseSenderBlock)callback) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
        
        UIView *view = viewRegistry[reactTag];
        if (!view) {
            RCTLogError(@"Cannot find view with tag #%@", reactTag);
            return;
        }

        
        UIScrollView *scrollView = ((RCTScrollView *)view).scrollView;

        UIColor *tintColor = options[@"tintColor"];
        NSString* title = options[@"title"];
        
        UIRefreshControl *refreshControl = [[UIRefreshControl alloc] init];
        if (tintColor) refreshControl.tintColor = [RCTConvert UIColor:tintColor];
        if (title)     refreshControl.attributedTitle = [[NSAttributedString alloc] initWithString:title];
        
        [refreshControl addTarget:self action:@selector(dropViewDidBeginRefreshing:) forControlEvents:UIControlEventValueChanged];

        refreshControl.tag = [reactTag integerValue]; // Maybe something better

        [scrollView addSubview:refreshControl];

        callback(@[[NSNull null], reactTag]);
    }];
}

RCT_EXPORT_METHOD(endRefreshing:(NSNumber *)reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, RCTSparseArray *viewRegistry) {
        
        UIView *view = viewRegistry[reactTag];
        if (!view) {
            RCTLogError(@"Cannot find view with tag #%@", reactTag);
            return;
        }
        
        UIScrollView *scrollView = ((RCTScrollView *)view).scrollView;
        
        UIRefreshControl *refreshControl = (UIRefreshControl *)[scrollView viewWithTag:[reactTag integerValue]];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            [refreshControl endRefreshing];
        });
    }];
}

- (void)dropViewDidBeginRefreshing:(UIRefreshControl *)refreshControl {
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"dropViewDidBeginRefreshing"
                                                    body:@(refreshControl.tag)];
}


@end
