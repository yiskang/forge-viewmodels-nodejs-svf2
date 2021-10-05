/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

var viewer = null;

function launchViewer(models) {
  if (viewer != null) {
    viewer.tearDown()
    viewer.finish()
    viewer = null
    $("#forgeViewer").empty();
  }

  if (!models || models.length <= 0)
    return alert('Empty `models` input');

  var options = {
    env: 'MD20ProdUS',
    api: 'D3S',
    getAccessToken: getForgeToken
  };

  if (LMV_VIEWER_VERSION >= '7.48') {
    options.env = 'AutodeskProduction2';
    options.api = 'streamingV2';
  }

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'));

    //load model one by one in sequence
    const util = new MultipleModelUtil(viewer);
    viewer.multipleModelUtil = util;

    // Use ShareCoordinates alignment instead
    // See https://github.com/yiskang/MultipleModelUtil for details
    // util.options = {
    //   alignment: MultipleModelAlignmentType.ShareCoordinates
    // };

    util.processModels(models);
  });
}

function getForgeToken(callback) {
  jQuery.ajax({
    url: '/api/forge/oauth/token',
    success: function (res) {
      callback(res.access_token, res.expires_in)
    }
  });
}
