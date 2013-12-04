/*!
 * popo.overlap.js v0.1 nightly
 * A JavaScript library for detecting collisions
 * http://github.com/niklasramo/popo
 * Copyright (c) 2012, 2013 Niklas Rämö
 * Released under the MIT license
 */

(function (window, undefined) {
  'use strict';

  var lib = 'overlap',
      win, doc, docElem, body;

  function getElemData(el) {

    return {
      element: el,
      width: popo.width(el),
      height: popo.height(el),
      offset: popo.offset(el, 1)
    };

  }

  function getOverlapData(targetData, opponentData) {

    return {
      left: targetData.offset.left - opponentData.offset.left,
      right: (opponentData.offset.left + opponentData.width) - (targetData.offset.left + targetData.width),
      top: targetData.offset.top - opponentData.offset.top,
      bottom: (opponentData.offset.top + opponentData.height) - (targetData.offset.top + targetData.height)
    };

  }

  function getIntersectionData(targetData, opponentData, overlapData) {

    var intersection = {
      width: targetData.width + (overlapData.left < 0 ? overlapData.left : 0) + (overlapData.right < 0 ? overlapData.right : 0),
      height: targetData.height + (overlapData.top < 0 ? overlapData.top : 0) + (overlapData.bottom < 0 ? overlapData.bottom : 0),
      offset: {
        left: null,
        top: null
      },
      coverage: {
        target: 0,
        opponent: 0
      }
    };

    // If target overlaps opponent
    if (intersection.width > 0 && intersection.height > 0) {

      // Get intersection offset
      intersection.offset.left = targetData.offset.left + Math.abs(overlapData.left < 0 ? overlapData.left : 0);
      intersection.offset.top = targetData.offset.top + Math.abs(overlapData.top < 0 ? overlapData.top : 0);

      // Get intersection coverage
      intersection.coverage.target = ((intersection.width * intersection.height) / (targetData.width * targetData.height)) * 100;
      intersection.coverage.opponent = ((intersection.width * intersection.height) / (opponentData.width * opponentData.height)) * 100;
      intersection.coverage.total = intersection.coverage.target + intersection.coverage.opponent;

    }

    return intersection;

  }

  function getInstanceData(targetData, opponent) {

    var opponentData = getElemData(opponent),
        overlapData = getOverlapData(targetData, opponentData),
        intersectionData = getIntersectionData(targetData, opponentData, overlapData),
        instanceData = {
          opponent: opponentData,
          intersection: intersectionData,
          crash: intersection.offset.left === null ? false : true
        };

    return instanceData;

  }

  function checkOverlap(target, opponents, returnData) {

    // Get the base elements
    doc = target.ownerDocument;
    win = doc.defaultView || doc.parentWindow;
    docElem = doc.documentElement;
    body = doc.body;

    var targetData = getElemData(target),
        opponents = opponents instanceof Array ? opponents : [opponents],
        opponentsLen = opponents.length,
        opponentsData = [],
        crashData = [],
        match = null,
        matchCoverage = 0,
        retData;

    // Loop through opponents
    for (var i = 0; i < opponentsLen; i++) {
      (function (i) {

        // Get instance data
        var instanceData = getInstanceData(targetData, opponents[i]);

        // Push instance to opponents data
        opponentsData.push(instanceData);

        // Keep track of all crashes
        if (instanceData.crash) {
          crashData.push(instanceData);
        }

        // Keep track of the crash with the largest coverage
        if (instanceData.intersection.coverage.total > matchCoverage) {
          match = instanceData;
        }

      })(i);
    }

    // Create return data object.
    retData = {
      target: targetData,
      opponents: opponentsData,
      crashes: crashData,
      match: match
    };

    return returnData ? retData : retData.crashes.length;

  }

  // Make the library public.
  if (window.popo) {
    window.popo[lib] = window.popo[lib] || checkOverlap;
  }

})(self);